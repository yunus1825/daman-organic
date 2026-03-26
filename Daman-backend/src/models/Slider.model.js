import mongoose from "mongoose";

const SliderSchema = new mongoose.Schema(
  {
    Tittle: {
      type: String,
      required: false,
      trim: true,
    },
    Description: {
      type: String,
      required: false,
      trim: true,
    },
    Image: {
      type: String,
      required: true,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Slider = mongoose.model("colSlider", SliderSchema);

export default Slider;
