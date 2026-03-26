import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { currencySymbol } from "../../../constants/constants";
import { removeWishlistItem } from "../../../redux/slices/wishlistSlice";
import { ImSpinner2 } from "react-icons/im";
import RouterLink from "../../../components/global/RouterLink";
const WhishlistMobileItem = ({ item }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsloading] = useState(false);
  const userId = useSelector((state) => state.auth.user?._id);
  const handleDelete = async (id) => {
    // Handle delete item from wishlist
    if (isLoading) return;
    try {
      setIsloading(true);
      await dispatch(
        removeWishlistItem({ userId, productId: item?.productId })
      ).unwrap();
      console.log("Delete item with id:", id);
    } catch (error) {
      console.error("Toggle wishlist error", error);
    } finally {
      setIsloading(false);
    }
  };

  const handleAddToCart = (item) => {
    // Handle add to cart
    console.log("Add to cart:", item);
  };
  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <motion.div
      key={item._id}
      className="p-4 border-b border-gray-200"
      variants={itemVariants}
      whileHover={{ scale: 1.01 }}
      layout
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 h-16 w-16">
          <motion.img
            className="h-16 w-16 rounded object-cover"
            src={item?.product?.image}
            alt={item?.product?.name}
            whileHover={{ scale: 1.05 }}
            loading="lazy"
          />
        </div>
        <div className="ml-4 flex-1">
          <div className="flex justify-between">
            <div>
              <div className="text-sm font-medium text-gray-900">
                {item?.product?.name}
              </div>
              <div className="text-xs text-gray-500">
                {item?.product?.quantity} {item?.product?.Type}
              </div>
            </div>

            {isLoading ? (
              <motion.span
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ImSpinner2 className="animate-spin text-primary" />
              </motion.span>
            ) : (
              <motion.button
                onClick={() => handleDelete(item?.product?._id)}
                className="text-red-600 hover:text-red-900 cursor-pointer focus:outline-none"
                aria-label="Remove from wishlist"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </motion.button>
            )}
          </div>
          <div className="mt-2">
            <p className="text-sm font-semibold">
              {currencySymbol} {item?.product?.selling_price?.toFixed(2)}{" "}
              <span className="line-through text-gray-500">
                {currencySymbol}
                {item?.product?.display_price?.toFixed(2)}
              </span>
            </p>
          </div>
          <div className="mt-2 flex justify-between items-center">
            <span
              className={`px-2 inline-flex text-xs leading-5 font-medium text-center rounded-full 
                        ${
                          item?.product?.status
                            ? "text-primary"
                            : "text-red-500"
                        }`}
            >
              {item?.product?.status ? "In Stock" : "Out of Stock"}
            </span>
            <motion.button
              onClick={() => handleAddToCart(item)}
              variants={buttonVariants}
              whileHover={item.inStock ? "hover" : ""}
              whileTap={item.inStock ? "tap" : ""}
            >
              <RouterLink
                className={`px-3 py-3 text-center w-full rounded text-sm cursor-pointer focus:outline-none ${"bg-primary text-white hover:bg-primaryDark hover:scale-110 transition-all"}`}
                to={`/product/${item?.product?.prd_Name}/${item?.productId}`}
              >
                View Details
              </RouterLink>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WhishlistMobileItem;
