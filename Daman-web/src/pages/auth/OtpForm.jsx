import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import BtnSpinner from "../../components/global/BtnSpinner";
import {
  containerVariants,
  itemVariants,
  otpInputVariants,
} from "./variants.js";

const OtpForm = ({
  otpDigits,
  otpInputRefs,
  handleOtpChange,
  handleKeyDown,
  handleVerifyOtp,
  handleSendOtp,
  isLoading,
}) => {
  const [timer, setTimer] = useState(30);

  // countdown effect
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const onSubmit = (e) => {
    e.preventDefault();
    handleVerifyOtp();
  };

  const onResend = () => {
    handleSendOtp();
    setTimer(30); // reset timer
  };

  return (
    <motion.form
      key="otpForm"
      onSubmit={onSubmit}
      className="w-full flex flex-col justify-center items-center"
      variants={containerVariants}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div className="w-full" variants={itemVariants}>
        <h3 className="text-left font-bold text-2xl mb-2">OTP Verification</h3>
        <p className="text-gray-500">
          Enter the verification code we just sent to your <br /> phone number.
        </p>
      </motion.div>

      <motion.div
        className="flex justify-between gap-5 w-full my-8"
        variants={containerVariants}
      >
        {otpDigits.map((digit, index) => (
          <motion.input
            key={index}
            type="text"
            placeholder="-"
            ref={otpInputRefs[index]}
            value={digit}
            onChange={(e) => handleOtpChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-full h-16 text-3xl text-center border-2 border-gray-400 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
            maxLength={1}
            inputMode="numeric"
            pattern="[0-9]*"
            variants={otpInputVariants}
            whileFocus="focus"
            whileHover="hover"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          />
        ))}
      </motion.div>

      <motion.div className="w-full" variants={itemVariants}>
        <BtnSpinner
          type="submit"
          loading={isLoading}
          disabled={isLoading}
          className={`w-full mt-6 cursor-pointer bg-primary text-white font-semibold py-3 rounded-md flex items-center justify-center transition-opacity ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Verify
        </BtnSpinner>
      </motion.div>

      <motion.p className="text-gray-500 mt-4" variants={itemVariants}>
        Didn’t receive code?{" "}
        {timer > 0 ? (
          <span className="text-gray-400 font-medium">Resend in {timer}s</span>
        ) : (
          <button
            type="button"
            onClick={onResend}
            className="text-primaryDark cursor-pointer hover:text-blue-800 font-medium"
          >
            Resend
          </button>
        )}
      </motion.p>
    </motion.form>
  );
};

export default OtpForm;
