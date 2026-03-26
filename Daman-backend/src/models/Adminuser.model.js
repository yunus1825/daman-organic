import mongoose from "mongoose";

const adminuserSchema = new mongoose.Schema(
  {
    customId: { 
      type: String,
      unique: true ,
    },
    phone: {
      type: Number,
      unique: true,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: [false, "Name required!"],
      trim: true,
    },
    gender: {
      type: String,
      required: [false, "Name required!"],
      trim: true,
    },
    email: {
      type: String,
      lowercase: false,
      trim: true,
      unique: true,
      required: [false, "Email required!"],
      validate: {
        validator: function (v) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    password:{
      type:String,
      trim:true,
      required: [true, "Email required!"],
    },
    country_code: {
      type: String,
      required: [false,"Country Code Required"],
      trim: true,
    },
    Address: {
      type: String,
      required: [false,"Address Required"],
      trim: true,
    },
    LoginDateTime: {
      type: Date,
      required: [false,"Login Date Auto Update"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);
// Middleware to generate user ID before saving
adminuserSchema.pre('save', async function (next) {
  if (!this.isNew) return next();

  try {
    // Find the highest customId in the collection
    const highestCustomIdUser = await this.constructor
      .findOne({}, { customId: 1 })
      .sort({ customId: -1 });

    let nextCustomIdNumber = 1;

    if (highestCustomIdUser && highestCustomIdUser.customId) {
      // Extract the numeric part, increment, and pad with zeros
      const currentCustomIdNumber = parseInt(
        highestCustomIdUser.customId.replace(/\D/g, ''), // Extract numeric part
        10
      );

      if (!isNaN(currentCustomIdNumber)) {
        nextCustomIdNumber = currentCustomIdNumber + 1;
      }
    }

    // Set the prefix for the user ID
    const prefix = 'User'; 
    // Concatenate prefix with auto-incrementing number
    const customId = `${prefix}${String(nextCustomIdNumber).padStart(4, '0')}`;
    this.customId = customId;
    next();
  } catch (error) {
    next(error);
  }
});

const AdminUser = mongoose.model("colAdminUser", adminuserSchema);
export default AdminUser;
