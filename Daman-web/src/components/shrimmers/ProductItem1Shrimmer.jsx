import React from "react";
import { motion } from "framer-motion";

const ProductItem1Shrimmer = () => {
  return (
    <motion.div
      className="product-item-shimmer relative border-gray-200 border rounded-lg p-3 sm:p-4 w-full max-w-[280px] sm:max-w-xs mx-auto bg-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Favorite Button and Discount Tag Shimmer */}
      <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
        <div className="w-10 h-6 bg-gray-200 rounded-md animate-pulse"></div>
      </div>
      <div className="absolute top-2 sm:top-3 right-2 sm:right-3 shadow bg-white p-2 sm:p-3 rounded-full text-lg sm:text-xl">
        <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse"></div>
      </div>

      {/* Product Image Shimmer */}
      <div className="product-image mb-3 sm:mb-4 overflow-hidden">
        <div className="w-full h-32 sm:h-40 bg-gray-200 animate-pulse rounded-md"></div>
      </div>

      {/* Product Details Shimmer */}
      <div className="text-sm sm:text-base mb-1 sm:mb-2">
        <div className="w-1/3 h-4 bg-gray-200 animate-pulse rounded-md"></div>
      </div>
      <div className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">
        <div className="w-full h-5 bg-gray-200 animate-pulse rounded-md mb-1"></div>
        <div className="w-2/3 h-5 bg-gray-200 animate-pulse rounded-md"></div>
      </div>
      
      {/* Price Shimmer */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1/4 h-6 bg-gray-200 animate-pulse rounded-md"></div>
        <div className="w-1/4 h-4 bg-gray-200 animate-pulse rounded-md"></div>
      </div>

      {/* Options Dropdown Shimmer */}
      <div className="mb-3">
        <div className="w-full h-8 bg-gray-200 animate-pulse rounded-md"></div>
      </div>

      {/* Add to Cart Button Shimmer */}
      <div className="w-full h-10 bg-gray-200 animate-pulse rounded-md"></div>
    </motion.div>
  );
};

export default ProductItem1Shrimmer;