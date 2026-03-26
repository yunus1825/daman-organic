import mongoose from "mongoose";

const DeliveryChargesSchema = new mongoose.Schema(
  {
    tittle: {
      type: String,
      required: [true, "city required!"],
      
    },
    kms: {
        type: Number,
        required: [true,"area required! "],
        unique: true,
        
    },
    charges: {
        type: Number,
        required: [true, "Pincode required!"],
        // unique: true,
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

const DeliveryCharges = mongoose.model("colDeliveryCharges", DeliveryChargesSchema);

export default DeliveryCharges;
