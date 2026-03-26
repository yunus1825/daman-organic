import { motion } from "framer-motion";
import { FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa";
import RouterLink from "./RouterLink";

const EmptyWishlistMessage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center p-8 bg-white rounded-lg  max-w-md mx-auto"
    >
      <div className="flex flex-col items-center space-y-6">
        {/* Animated heart container */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 3,
          }}
          className="relative"
        >
          <FaRegHeart className="text-6xl text-gray-300" />
          
          {/* Floating small hearts */}
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 1, 0], y: -20 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1,
            }}
            className="absolute top-0 left-6"
          >
            <FaHeart className="text-xl text-primary" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 1, 0], y: -20 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1.5,
            }}
            className="absolute top-2 right-2"
          >
            <FaHeart className="text-lg text-primary" />
          </motion.div>
        </motion.div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-800">Your wishlist is empty</h2>
          <p className="text-gray-600">
            You haven't saved any items yet. Start exploring to find things you love!
          </p>
        </div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="pt-2"
        >
          <RouterLink
            to="/"
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:shadow-md transition-all"
          >
            <FaShoppingCart className="text-lg" />
            Start Shopping
          </RouterLink>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EmptyWishlistMessage;