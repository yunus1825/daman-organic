import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaTimesCircle, FaHome } from "react-icons/fa";
import withLayout from "../../components/withLayout";
import { useNavigate, useParams } from "react-router-dom";
import RouterLink from "../../components/global/RouterLink";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../../redux/slices/ordersSlice";

const PaymentStatus = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { status, orderId } = useParams();
  const userId = useSelector((state) => state.auth?.user?._id); // Assuming you have auth state

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const goToOrderHistory = async () => {
    try {
      if (userId) {
        dispatch(fetchOrders(userId)); // assuming it's a thunk returning a promise
      }
      navigate("/profile/orders");
    } catch (error) {
      console.error("Failed to fetch order history", error);
    } finally {
    }
  };

  return (
    <div className="min-h-[90vh] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center"
        >
          <div className="flex justify-center mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Processing Payment
          </h2>
          <p className="text-gray-600">
            Please wait while we complete your transaction
          </p>
        </motion.div>
      )}

      <AnimatePresence>
        {status === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
              className="flex justify-center mb-6"
            >
              <div className="relative">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                  <FaCheckCircle className="text-primary text-5xl" />
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="absolute -top-2 -right-2"
                >
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <FaCheckCircle className="text-white text-lg" />
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Payment Successful!
              </h2>
              <p className="text-gray-600">
                Your transaction has been completed successfully.
              </p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-4 text-primary font-medium"
              >
                Order ID: {orderId}
              </motion.p>
            </div>

            <div className="flex flex-col space-y-3">
              <button
                onClick={goToOrderHistory}
                className="bg-primary hover:bg-primaryDark text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center space-x-2"
              >
                <span>Go to Order History</span>
              </button>
            </div>
          </motion.div>
        )}
        {status === "cod" && (
          <motion.div
            key="cod"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
              className="flex justify-center mb-6"
            >
              <div className="relative">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                  <FaCheckCircle className="text-primary text-5xl" />
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="absolute -top-2 -right-2"
                >
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <FaCheckCircle className="text-white text-lg" />
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Order Placed!
              </h2>
              <p className="text-gray-600">
                Your order has been placed successfully. Please keep the cash
                ready upon delivery.
              </p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-4 text-primary font-medium"
              >
                Order ID: {orderId}
              </motion.p>
            </div>

            <div className="flex flex-col space-y-3">
              <button
                onClick={goToOrderHistory}
                className="bg-primary hover:bg-primaryDark text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center space-x-2"
              >
                <span>Go to Order History</span>
              </button>
            </div>
          </motion.div>
        )}

        {status === "failed" && (
          <motion.div
            key="failed"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
              className="flex justify-center mb-6"
            >
              <div className="relative">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
                  <FaTimesCircle className="text-red-600 text-5xl" />
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="absolute -top-2 -right-2"
                >
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                    <FaTimesCircle className="text-white text-lg" />
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Payment Failed
              </h2>
              <p className="text-gray-600">
                We couldn't process your payment. Please try again.
              </p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-4 text-red-600 font-medium"
              >
                Error: Insufficient funds
              </motion.p>
            </div>

            <div className="flex flex-col space-y-3">
              <RouterLink className="border border-gray-300 cursor-pointer hover:bg-gray-50 text-gray-700 py-3 px-6 rounded-lg font-medium flex items-center justify-center space-x-2">
                <FaHome />

                <span>Go to Home</span>
              </RouterLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default withLayout(PaymentStatus);
