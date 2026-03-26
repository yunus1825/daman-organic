import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  addWishlistItem,
  removeWishlistItem,
} from "../../../redux/slices/wishlistSlice";
import { message } from "antd";
import { ImSpinner2 } from "react-icons/im";
const AddToWishlist = ({ productId, userId, setShowLoginPopup }) => {
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
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      className="w-full border cursor-pointer flex justify-center items-center gap-5  p-1.5 sm:p-1.5 rounded-md font-medium"
    >
      <p> {isFavorite ? "Remove from wishlist" : "Add to wishlist"} </p>
      <AnimatePresence mode="wait">
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
        ) : isFavorite ? (
          <motion.span
            key="filled"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <FaHeart className="text-red-500" />
          </motion.span>
        ) : (
          <motion.span
            key="outline"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <FaRegHeart />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default AddToWishlist;
