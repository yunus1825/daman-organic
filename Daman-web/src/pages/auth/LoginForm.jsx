import { motion } from "framer-motion";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import damanlogo from "../../assets/images/damanheaderlogo.png";
import BtnSpinner from "../../components/global/BtnSpinner";
import { containerVariants, itemVariants } from "./variants.js";
import RouterLink from "../../components/global/RouterLink.jsx";

const LoginForm = ({ phone, setPhone, handleSendOtp, isLoading }) => {
  const onSubmit = (e) => {
    e.preventDefault(); // prevent page refresh
    handleSendOtp();
  };

  return (
    <motion.form
      key="loginForm"
      onSubmit={onSubmit}
      className="w-full flex flex-col justify-center items-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div className="flex items-center gap-3" variants={itemVariants}>
        <h3 className="font-semibold text-3xl">Login to</h3>
        <motion.img
          className="h-10"
          src={damanlogo}
          alt="damanlogo"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        />
      </motion.div>

      <motion.div className="w-full gap-2 mt-10 flex" variants={itemVariants}>
        <PhoneInput
          international
          defaultCountry="IN"
          disabled={true}
          placeholder="Enter phone number"
          className="border-2 border-gray-500 rounded-sm p-2 w-23"
        />
        <input
          onChange={(e) => setPhone(e.target.value)}
          value={phone}
          className="border-2 border-gray-500 rounded-sm p-3 w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          type="number"
          placeholder="Enter phone number"
        />
      </motion.div>

      <motion.div className="w-full mt-10" variants={itemVariants}>
        <BtnSpinner
          type="submit" // important for form submit
          disabled={isLoading}
          loading={isLoading}
          className={`w-full cursor-pointer bg-primary text-white font-semibold py-3 rounded-sm flex items-center justify-center transition-opacity ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Continue
        </BtnSpinner>
      </motion.div>

      <motion.p className="mt-4 font-light" variants={itemVariants}>
        By Proceeding, You agree to our{" "}
        <span className="text-primary">
          <RouterLink to={"/policy/terms"}>T & C</RouterLink>
        </span>{" "}
        and{" "}
        <span className="text-primary">
          <RouterLink to={"/policy/privacy"}>Privacy Policy</RouterLink>
        </span>
      </motion.p>
    </motion.form>
  );
};

export default LoginForm;
