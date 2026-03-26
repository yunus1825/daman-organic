// models/Marquee.js
import mongoose from "mongoose";

const marqueeSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    isActive: { type: Boolean, default: true }, // optional
  },
  { timestamps: true }
);

export default mongoose.model("Marquee", marqueeSchema);
