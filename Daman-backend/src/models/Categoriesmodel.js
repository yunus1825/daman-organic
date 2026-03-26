import mongoose from "mongoose";
// Counter schema to keep track of order numbers
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // sequence name
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.model("Counter", counterSchema);

const CategoriesSchema = new mongoose.Schema(
  {
    CategoryName: {
      type: String,
      // unique: true,
      required: [true, "Service Category required!"],
      trim: true,
    },
    Description: {
      type: String,
      required: [true, "Description required!"],
      trim: true,
    },
    Image: {
      type: String,
      required: [true, "Image required!"],
      trim: true,
    },
    order: {
      type: Number,
      required: [false, "status flag required!"],
    },
    status: {
      type: Boolean,
      required: [true, "status flag required!"],
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Auto-increment order before saving a new category
CategoriesSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "categoryOrder" }, // sequence name
      { $inc: { seq: 1 } }, // increment by 1
      { new: true, upsert: true }, // create if not exists
    );
    this.order = counter.seq;
  }
  next();
});

const Categories = mongoose.model("colCategories", CategoriesSchema);

export default Categories;
