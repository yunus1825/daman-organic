import { motion } from "framer-motion";
import Logo from "../../assets/images/damanheaderlogo.png";
const NoInternetScreen = () => {
  return (
    <div className="flex items-center justify-center h-screen  text-gray-800">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white  rounded-2xl p-8 max-w-md text-center"
      >
        {/* Website Logo */}
        <motion.img
          src={Logo} // 👉 replace with your logo path
          alt="Website Logo"
          className=" h-20 mx-auto mb-4"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />

        {/* Animated Icon */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-6xl mb-4"
        >
          📡
        </motion.div>

        {/* Text */}
        <h1 className="text-2xl font-semibold mb-2">No Internet Connection</h1>
        <p className="text-gray-600 mb-6">
          Oops! It looks like you’re offline. Please check your connection and
          try again.
        </p>

        {/* Retry Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
        >
          Retry
        </motion.button>
      </motion.div>
    </div>
  );
};

export default NoInternetScreen;
