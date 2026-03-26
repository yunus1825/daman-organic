import React, { useState } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer, cardVariants } from "../../../utils/motion";
import api from "../../../utils/api";
import { useSelector } from "react-redux";
import { message } from "antd";

const OrderDetailItem = ({ item, orderId, orderStatus }) => {
  const [rating, setRating] = useState(item?.userRating || 0);
  const [review, setReview] = useState(item?.userReview || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userId = useSelector((state) => state.auth?.user?._id); // Assuming you have auth state
  // Use variant data if available, otherwise use product data
  const productData = item.productDetail;
  const productName = item.prd_Name;
  const productPrice = item.productPrice;
  const quantity = item.quantity;
  const image = productData?.image;

  const variant = item?.selectedVariant;
  const unit_value = variant
    ? variant?.quantity
    : item?.productDetail?.quantity;
  const unit_type = variant ? variant?.Type : item?.productDetail?.Type;

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    await handleReviewSubmit();
    setIsSubmitting(false);
  };

  const handleReviewSubmit = async () => {
    try {
      if (!userId) {
        message.error("Please login to sumbit you review");
      }
      const response = await api.put(
        `/api/damanorganic/productReview/${item?.productDetail?._id}`,
        {
          userId: userId,
          ordId: orderId,
          review: review,
        }
      );
      if (response.data.code === 200) {
        message.success("Your review has been submitted");
      }
    } catch (error) {
      setReview(item.userReview || "");
      message.error(error.response.data.message || "Failed to submit review");
    }
  };

  const handleRatingPress = async (star) => {
    try {
      if (!userId) {
        message.error("Please login to sumbit you Rating");
      }
      const response = await api.put(
        `/api/damanorganic/productRating/${item?.productDetail?._id}`,
        {
          userId: userId,
          ordId: orderId,
          rating: star,
        }
      );
      if (response.data.code === 200) {
        message.success("Your rating has been submitted");
      }
    } catch (error) {
      setRating(item.userRating);
      message.error(error.response.data.message || "Failed to submit rating");
    }
  };
  return (
    <motion.div
      custom={{ orderStatus, isAccepted: item?.isAccepted }}
      variants={cardVariants}
      initial="hidden"
      animate="show"
      className={`${
        orderStatus !== "Open" && !item?.isAccepted ? "line-through" : ""
      } border-[1px] mb-5 rounded-2xl border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-300`}
    >
      <div className="p-5">
        {/* Product Header */}
        <motion.div
          variants={fadeIn("right", "tween", 0.1, 0.5)}
          className="flex justify-between pb-5 items-center border-b border-gray-200"
        >
          <div>
            <h3 className="md:text-xl font-semibold text-gray-800">
              {productName} {`(${unit_value} ${unit_type})`}
            </h3>
            <div className="flex items-center gap-2">
              <p className="font-bold md:text-2xl text-primary">
                ₹ {productPrice}
              </p>
              <p className="text-gray-500">x {quantity}</p>
              <p className="font-bold text-gray-700">
                = ₹ {productPrice * quantity}
              </p>
            </div>
          </div>
          {image && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="h-[100px] w-[100px] rounded-2xl overflow-hidden shadow-md"
            >
              <img
                src={image}
                alt={productName}
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}
        </motion.div>

        {/* Rating and Review Section */}
        {orderStatus === "Delivered" && (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="pt-4"
          >
            <motion.p
              variants={fadeIn("up", "tween", 0.2, 0.5)}
              className="py-3 text-gray-600 font-medium"
            >
              Share your experience with this product:
            </motion.p>

            {/* Star Rating */}
            <motion.div
              variants={fadeIn("up", "tween", 0.3, 0.5)}
              className="flex mb-4 items-center"
            >
              <div className="flex mr-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.span
                    key={star}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setRating(star);
                      handleRatingPress(star);
                    }}
                    className="text-2xl cursor-pointer transition-colors"
                    style={{
                      color: star <= rating ? "#FFD700" : "#CBD5E0",
                    }}
                  >
                    {star <= rating ? <AiFillStar /> : <AiOutlineStar />}
                  </motion.span>
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {rating > 0
                  ? `You rated ${rating} star${rating > 1 ? "s" : ""}`
                  : "Tap to rate"}
              </span>
            </motion.div>

            {/* Review Input */}
            <motion.div variants={fadeIn("up", "tween", 0.4, 0.5)}>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="border-[1px] p-3 w-full outline-none border-gray-300 rounded-lg mb-4 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all min-h-[100px]"
                placeholder="Share details about your experience..."
              />
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={fadeIn("up", "tween", 0.5, 0.5)}>
              <motion.button
                onClick={() => {
                  handleSubmit();
                  // Handle submit logic here
                  // Then set isSubmitting to false
                }}
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-4 py-2 rounded-lg text-white font-medium w-full transition-all ${
                  isSubmitting
                    ? "bg-primary/70"
                    : "bg-primary hover:bg-primary-dark"
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  "Submit Review"
                )}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default OrderDetailItem;
