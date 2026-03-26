import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
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
      default: null,
    },
    userImage: {
      type: String,
      required: [false, "User Image required!"],
      trim: true,
    },
    email: {
      type: String,
      lowercase: false,
      trim: true,
      required: [false, "Email required!"],
      validate: {
        validator: function (v) {
          if (v && v.length > 0) {
            return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        }
        return true; 
    },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    password: {
      type: String,
      required: [false, "Password required!"],
      trim: true,
    },
    country_code: {
      type: String,
      required: false,
      trim: true,
    },
    otp: {
      type: Number,
      required: false,
      trim: true,
    },
    signUpdate: {
      type: Date,
      required: false,
      default: Date.now(),
    }, 
    
  },
  {
    timestamps: true,
  }
);
// Middleware to generate user ID before saving
userSchema.pre('save', async function (next) {
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
        highestCustomIdUser.customId.slice(1),
        10
      );
      nextCustomIdNumber = currentCustomIdNumber + 1;
    }

    // Set the prefix for the user ID
    const prefix = 'U'; 
    // Concatenate prefix with auto-incrementing number
    const customId = `${prefix}${String(nextCustomIdNumber).padStart(4, '0')}`;
    this.customId = customId;
    next();
  } catch (error) {
    next(error);
  }
});


const User = mongoose.models.colUser || mongoose.model("colUser", userSchema);
export default User;
