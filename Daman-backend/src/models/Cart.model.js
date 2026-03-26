import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: [false, "User Id required!"],
      trim: true,
    },
    productId: {
      type: mongoose.Types.ObjectId,
      required: [false, "Product Id required!"],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity required!"],
      default: false,
    },
    variantId: {
      type: mongoose.Types.ObjectId,
      required: false,
      trim: true,
    },
    status: {
      type: Boolean,
      required: [true, "status flag required!"],
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("colCart", CartSchema);

export default Cart;
