import React, { useState } from "react";
import { currencySymbol } from "../../../constants/constants";
import { motion } from "framer-motion";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  updateCartItemQuantity,
  removeCartItem,
} from "../../../redux/slices/cartSlice";
import { message } from "antd";

const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(item.quantity);
  const [loading, setLoading] = useState(false);
  const userId = useSelector((state) => state.auth.user?._id);

  const product = item.product;
  const variant = item.product.variantData;
  const hasVariant = variant;

  // Stock availability
  const isOutOfStock = hasVariant ? variant?.inStock : item.product.status;

  // Calculate prices
  const price = hasVariant ? variant.selling_Price : product.selling_price;
  const displayPrice = hasVariant
    ? variant.display_price
    : product.display_price;
  const unit_value = hasVariant ? variant.quantity : product.quantity;
  const unit_type = hasVariant ? variant.Type : product.Type;
  const subtotal = price * quantity;
  const savings = (displayPrice - price) * quantity;

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;

    setLoading(true);
    try {
      await dispatch(
        updateCartItemQuantity({
          userId,
          productId: product._id,
          quantity: newQuantity,
          variantId: hasVariant ? variant._id : null,
        })
      ).unwrap();
      setQuantity(newQuantity);
    } catch (error) {
      message.error("Failed to update quantity");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async () => {
    setLoading(true);
    try {
      await dispatch(removeCartItem(item._id)).unwrap();
    } catch (error) {
      message.error("Failed to remove item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="border-2 border-primary rounded-xl mt-5 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.005 }}
    >
      <div>
        <motion.div
          className="p-3 sm:p-4 flex justify-between items-center"
          style={{
            background:
              "linear-gradient(to right, rgba(138, 217, 254, 0.4) 10%, rgba(255, 255, 255, 0.6) 60%)",
          }}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <p className="text-primaryDark font-bold text-sm sm:text-base">
            {product.categoryName}
          </p>
        </motion.div>

        <div className="grid grid-cols-12 p-2 sm:p-3">
          <div className="col-span-6">
            <motion.div
              className="flex items-center gap-2 sm:gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img
                  className="h-16 w-16 sm:h-24 sm:w-24 object-cover rounded-sm overflow-hidden"
                  src={product?.image}
                  loading="lazy"
                  alt={product?.prd_Name}
                />
              </motion.div>
              <div>
                <motion.p
                  className="font-bold text-sm sm:text-base"
                  whileHover={{ color: "#3B82F6" }}
                >
                  {product.prd_Name}
                </motion.p>

                <motion.p className="text-xs sm:text-sm text-gray-600">
                  {unit_value} {unit_type}
                </motion.p>

                <div className="flex items-center gap-1 sm:gap-2">
                  <motion.p
                    className="font-bold text-sm sm:text-base"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                  >
                    {currencySymbol} {price.toFixed(2)}
                  </motion.p>
                  {displayPrice > price && (
                    <motion.p
                      className="line-through font-bold text-gray-500 text-xs sm:text-base"
                      initial={{ x: 20 }}
                      animate={{ x: 0 }}
                    >
                      {currencySymbol} {displayPrice.toFixed(2)}
                    </motion.p>
                  )}
                </div>
                <motion.button
                  onClick={handleRemoveItem}
                  disabled={loading}
                  className="text-red-500 cursor-pointer text-xs sm:text-sm flex items-center gap-1 mt-1"
                >
                  <FaTrash size={10} />
                  Remove
                </motion.button>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="col-span-3 flex items-center justify-center"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {!isOutOfStock ? (
              <span className="text-red-600 font-bold text-xs sm:text-sm">
                Out of Stock
              </span>
            ) : (
              <div className="flex items-center justify-between">
                <motion.div
                  className="quantity-selector px-1 sm:px-2 py-1 flex items-center justify-between border-2 border-gray-300 rounded-md overflow-hidden"
                  whileHover={{ boxShadow: "0 0 8px rgba(0,0,0,0.1)" }}
                >
                  <motion.button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="p-1 sm:p-2 text-white bg-primary hover:bg-primaryDark cursor-pointer rounded-[3px]"
                    disabled={quantity <= 1 || loading}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ backgroundColor: "#1D4ED8" }}
                  >
                    <FaMinus size={10} className="sm:size-[12px]" />
                  </motion.button>
                  <motion.span
                    className="px-2 sm:px-3 text-sm sm:text-base"
                    key={quantity}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {quantity}
                  </motion.span>
                  <motion.button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="p-1 sm:p-2 text-white bg-primary hover:bg-primaryDark cursor-pointer rounded-[3px]"
                    disabled={loading}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ backgroundColor: "#1D4ED8" }}
                  >
                    <FaPlus size={10} className="sm:size-[12px]" />
                  </motion.button>
                </motion.div>
              </div>
            )}
          </motion.div>

          <motion.div
            className="col-span-3 flex flex-col justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.p
              className="font-bold text-sm text-right sm:text-base"
              whileHover={{ scale: 1.05 }}
            >
              {`${currencySymbol} ${subtotal.toFixed(2)}`}
            </motion.p>
            {savings > 0 && (
              <motion.p
                className="text-primaryDark text-xs sm:text-sm"
                initial={{ y: 10 }}
                animate={{ y: 0 }}
              >
                Saved:{" "}
                <span className="font-bold">{`${currencySymbol} ${savings.toFixed(
                  2
                )}`}</span>
              </motion.p>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem;
