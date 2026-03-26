import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import {
  addWishlistItem,
  removeWishlistItem,
} from "../../redux/slices/wishlistSlice";
import { ImSpinner2 } from "react-icons/im"; // Spinner icon
import { message } from "antd";

const HeartProduct = ({ productId, userId, setShowLoginPopup }) => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.wishlist);
  const [isLoading, setIsloading] = useState(false);
  const [isFavorite, setIsFavourite] = useState(false);

  useEffect(() => {
    const isFavorite = items.some((item) => item?.product?._id === productId);
    setIsFavourite(isFavorite);
  }, [items]);

  const handleToggle = async () => {
    if (!userId) {
      setShowLoginPopup(true);
      return;
    }
    if (isLoading) return;
    setIsloading(true);
    try {
      if (isFavorite) {
        await dispatch(removeWishlistItem({ userId, productId })).unwrap();
      } else {
        await dispatch(addWishlistItem({ userId, productId })).unwrap();
      }
    } catch (error) {
      console.error("Toggle wishlist error", error);
    } finally {
      setIsloading(false);
    }
  };
  return (
    <motion.button
      onClick={handleToggle}
      className="absolute top-2 sm:top-3 right-2 sm:right-3 shadow bg-white p-2 sm:p-3 rounded-full text-lg sm:text-xl focus:outline-none cursor-pointer z-10"
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      whileTap={{ scale: 0.9 }}
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.span
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ImSpinner2 className="animate-spin text-primary h-3 w-3" />
          </motion.span>
        ) : isFavorite ? (
          <motion.span
            key="filled"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <FaHeart className="text-red-500 h-3 w-3" />
          </motion.span>
        ) : (
          <motion.span
            key="outline"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <FaRegHeart className="h-3 w-3" />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default HeartProduct;
