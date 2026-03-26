import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AiFillStar, AiOutlineStar, AiOutlineClose } from "react-icons/ai";
import RouterLink from "../../../components/global/RouterLink";

const OrderItem = ({ order }) => {
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const handleStarClick = (index) => {
    setRating(index);
  };

  const handleSubmitReview = () => {
    // Send review data to server here
    console.log({ rating, review });
    setShowRating(false);
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate total items in the order
  const totalItems = order.product_json.reduce((total, product) => {
    return total + product.quantity;
  }, 0);

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.15,
        ease: "easeIn",
      },
    },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <motion.div
      className="w-full rounded-2xl p-4 border-2 border-gray-300 bg-white mb-4"
      variants={itemVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Main Content */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        {/* Left Section */}
        <RouterLink className={"flex-1"} to={`/orderdetails/${order._id}`}>
          <div className="flex flex-1 flex-col  sm:flex-row gap-4">
            {/* Order Info */}

            <div>
              <h2 className="font-semibold text-lg">Order #{order.ordId}</h2>
              <p className="text-sm text-gray-500 mt-1">
                {totalItems} {totalItems === 1 ? "item" : "items"} •{" "}
                {formatDate(order.orderedDate)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Status:{" "}
                <span
                  className={`font-medium ${
                    order.ordStatus === "Delivered"
                      ? "text-green-600"
                      : order.ordStatus === "Cancelled"
                      ? "text-red-600"
                      : "text-blue-600"
                  }`}
                >
                  {order.ordStatus}
                </span>
              </p>
              <p className="text-sm font-medium mt-1">
                Total: ₹{order.subTotal}
              </p>
            </div>

            {/* Product Images */}
            <div className="flex flex-wrap gap-2 sm:w-auto">
              {order.product_json.slice(0, 3).map((product, index) => (
                <motion.img
                  key={index}
                  src={product.productDetail?.image}
                  alt={product.prd_Name}
                  loading="lazy"
                  className="w-16 h-16 object-cover rounded-md"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                />
              ))}
              {order.product_json.length > 3 && (
                <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
                  <span className="text-gray-500 text-sm">
                    +{order.product_json.length - 3}
                  </span>
                </div>
              )}
            </div>
          </div>
        </RouterLink>
        {/* Right Section - Buttons */}
        {/* <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-center justify-center gap-2 mt-2 sm:mt-0">
          <motion.button
            className="w-full sm:w-auto text-sm text-white cursor-pointer bg-primary px-4 py-2 rounded-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            RE-ORDER
          </motion.button>
          {order.ordStatus === "Delivered" && (
            <motion.button
              className="w-full sm:w-auto text-sm border text-gray-500 cursor-pointer font-medium border-gray-400 px-4 py-2 rounded-md"
              onClick={() => setShowRating(true)}
              whileHover={{ scale: 1.05, backgroundColor: "#f3f4f6" }}
              whileTap={{ scale: 0.95 }}
            >
              RATE ORDER
            </motion.button>
          )}
        </div> */}
      </div>

      {/* Rating Modal */}
      <AnimatePresence>
        {showRating && (
          <motion.div
            className="fixed inset-0 bg-black/45 bg-opacity-40 flex justify-center items-center z-50 p-4"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.div
              className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg relative mx-2"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.button
                className="absolute top-2 right-2 text-gray-500 hover:text-black"
                onClick={() => setShowRating(false)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <AiOutlineClose size={20} />
              </motion.button>
              <h3 className="text-lg font-semibold mb-4">Rate Your Order</h3>

              <div className="flex gap-1 mb-4 justify-center">
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {i <= rating ? (
                      <AiFillStar
                        size={24}
                        className="text-yellow-400 cursor-pointer"
                        onClick={() => handleStarClick(i)}
                      />
                    ) : (
                      <AiOutlineStar
                        size={24}
                        className="text-yellow-400 cursor-pointer"
                        onClick={() => handleStarClick(i)}
                      />
                    )}
                  </motion.div>
                ))}
              </div>

              <textarea
                placeholder="Write your review..."
                className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={4}
                value={review}
                onChange={(e) => setReview(e.target.value)}
              />

              <motion.button
                className="w-full bg-primary hover:bg-primaryDark text-white py-2 rounded-md transition-colors"
                onClick={handleSubmitReview}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={rating === 0}
              >
                Submit Review
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default OrderItem;
