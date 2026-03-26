import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: [false, "User Id required!"],
      trim: true,
    },
    customer_name: {
      type: String,
      required: [false, "Name required!"],
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
    addressType: {
      type: String,
      required: [false, "Address Type required!"],
      trim: true,
    },
    flatNo: {
      type: String,
      required: [false, "Flat No required!"],
    },
    phoneNo: {
      type: Number,
      required: [false, "Phone No required!"],
    },
    address: {
      type: String,
      required: [false, "Address required!"],
    },
    city: {
      type: String,
      required: [false, "City required!"],
    },
    area: {
      type: String,
      required: [false, "Area required!"],
    },
    street: {
      type: String,
      required: [false, "Area required!"],
    },
    appartment_name: {
      type: String,
      required: [false, "Area required!"],
    },
    landmark: {
      type: String,
      required: [false, "LandMark required!"],
      // default: false,
    },
    pincode: {
      type: Number,
      required: [false, "Pincode required!"],
      // default: false,
    },
    mapLink: {
      type: String,
      required: [false, "Map Link required!"],
      // default: false,
    },
    latitude: {
      type: Number,
      required: [false, "latitude required!"],
      default: null,
    },
    longitude: {
      type: Number,
      required: [false, "longitude required!"],
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Address = mongoose.model("colAddress", AddressSchema);

export default Address;
