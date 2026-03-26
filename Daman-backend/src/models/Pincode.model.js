import mongoose from "mongoose";

const PincodeSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: [true, "city required!"],
      
    },
    area: {
        type: String,
        required: [true,"area required! "],
        
    },
    pincode: {
        type: Number,
        required: [true, "Pincode required!"],
        unique: true,
    },
    status: {
       type: Boolean,
       required:  [true, "status required"],
       default: true,
    }

  },
  {
    timestamps: true,
  }
);

const Pincode = mongoose.model("colPincodes", PincodeSchema);

export default Pincode;
