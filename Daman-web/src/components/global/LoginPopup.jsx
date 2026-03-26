import { AnimatePresence, motion } from "framer-motion";
import React, { memo } from "react";
import { useNavigate } from "react-router-dom";

const LoginPopup = memo(
  ({ showLoginPopup, setShowLoginPopup, handleClosePopup }) => {
    const navigate = useNavigate();
    const handleNavigateToAuth = () => {
      setShowLoginPopup(false);
      navigate("/auth");
    };
    return (
      <AnimatePresence>
        {showLoginPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0  bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4"
            onClick={handleClosePopup}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Login Required
                </h3>
                <button
                  onClick={handleClosePopup}
                  className="text-gray-500 cursor-pointer hover:text-gray-700"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="mb-6">
                <svg
                  className="w-16 h-16 mx-auto text-yellow-500 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <p className="text-gray-600 text-center">
                  You need to log in to add items to your cart.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClosePopup}
                  className="flex-1 px-4 py-2 cursor-pointer bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Continue Browsing
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNavigateToAuth}
                  className="flex-1 px-4 py-2 cursor-pointer bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
                >
                  Go to Login
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

export default LoginPopup;
