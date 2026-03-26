import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import bgimage from "../../assets/auth/bannerimage2.webp";
import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm.jsx";
import OtpForm from "./OtpForm.jsx";
import { message } from "antd";
import api from "../../utils/api.js";
import { BsArrowLeft } from "react-icons/bs";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import BtnSpinner from "../../components/global/BtnSpinner.jsx";
const LoginWithOTP = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", ""]);
  const otpInputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const { isAuthenticated } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const handleOtpChange = (index, value) => {
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtpDigits = [...otpDigits];
      newOtpDigits[index] = value;
      setOtpDigits(newOtpDigits);
      setOtp(newOtpDigits.join(""));
      if (value && index < 3) {
        otpInputRefs[index + 1].current.focus();
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs[index - 1].current.focus();
    }
  };
  // Send OTP
  const handleSendOtp = async () => {
    if (!phone) {
      message.error("Please enter your phone number");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post("/api/damanorganic/send_otp", {
        country_code: "+91",
        phone: phone,
      });

      if (response.data.code === 200) {
        setIsOtpSent(true);
        setToken(response.data.data.token);
        message.success("OTP sent successfully!");
      } else {
        message.error(response.data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      message.error(err.response?.data?.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp) {
      message.error("Please enter the OTP");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post(
        "/api/damanorganic/verifylogin",
        {
          country_code: "+91",
          phone: Number(phone),
          otp: Number(otp),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.code === 200) {
        if (response.data.isFirstLogin) {
          // ✅ New user → show profile form
          setIsFirstLogin(true);
          localStorage.setItem("userId", response.data.data._id);
        } else {
          // ✅ Returning user → normal login
          message.success("OTP verified successfully!");
          localStorage.setItem("userId", response.data.data._id);
          navigate("/");
          window.location.reload();
        }
      } else {
        message.error(response.data.message || "Invalid OTP");
      }
    } catch (err) {
      console.error(err);
      message.error(err.response?.data?.message || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (data) => {
    setIsLoading(true);
    try {
      const response = await api.post("/api/damanorganic/update-profile", {
        phone: Number(phone),
        email: data.email,
        name: data.name,
      });

      if (response.data.code === 200) {
        message.success("Profile updated successfully!");
        navigate("/");
        window.location.reload();
      } else {
        message.error(response.data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      message.error(err.response?.data?.message || "Profile update failed");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen relative">
        <motion.div
          className="hidden md:block"
          style={{
            backgroundImage: `url(${bgimage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        <div className="flex relative justify-center items-center">
          <button
            onClick={() => navigate("/")}
            className="absolute cursor-pointer top-6 left-6  flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <BsArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="border-b border-transparent group-hover:border-gray-400">
              Back to Home
            </span>
          </button>
          <div className="flex w-[80%] md:w-[60%] mx-auto  justify-center items-center">
            {/* Back to Home Button */}

            <AnimatePresence mode="wait">
              {!isOtpSent ? (
                <LoginForm
                  phone={phone}
                  setPhone={setPhone}
                  handleSendOtp={handleSendOtp}
                  isLoading={isLoading}
                />
              ) : isFirstLogin ? (
                <motion.form
                  key="profileForm"
                  onSubmit={handleSubmit(handleUpdateProfile)}
                  className="w-full flex flex-col justify-center items-center"
                  variants={containerVariants}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div className="w-full mb-4" variants={itemVariants}>
                    <h2 className="font-semibold text-3xl">
                      Complete Your Profile
                    </h2>
                    <p className="text-gray-500 mt-1">
                      We just need a few details before continuing 🚀
                    </p>
                  </motion.div>
                  {/* Name Input */}
                  <motion.div className="w-full" variants={itemVariants}>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      {...register("name", {
                        required: "Name is required",
                        minLength: {
                          value: 2,
                          message: "Name must be at least 2 characters",
                        },
                      })}
                      className="p-2 w-full mb-2 border-2 border-gray-500 rounded-sm"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mb-2">
                        {errors.name.message}
                      </p>
                    )}
                  </motion.div>

                  {/* Email Input */}
                  <motion.div className="w-full" variants={itemVariants}>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Invalid email address",
                        },
                      })}
                      className="p-2 w-full mb-2 border-2 border-gray-500 rounded-sm"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mb-2">
                        {errors.email.message}
                      </p>
                    )}
                  </motion.div>
                  {/* Submit Button */}
                  <motion.div className="w-full" variants={itemVariants}>
                    <BtnSpinner
                      type="submit"
                      loading={isLoading}
                      disabled={isLoading}
                      className={`w-full mt-4 cursor-pointer bg-primary text-white font-semibold py-3 rounded-md flex items-center justify-center transition-opacity ${
                        isLoading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isLoading ? "Saving..." : "Save Profile"}
                    </BtnSpinner>
                  </motion.div>
                </motion.form>
              ) : (
                <OtpForm
                  otpDigits={otpDigits}
                  otpInputRefs={otpInputRefs}
                  handleOtpChange={handleOtpChange}
                  handleKeyDown={handleKeyDown}
                  handleVerifyOtp={handleVerifyOtp}
                  handleSendOtp={handleSendOtp}
                  isLoading={isLoading}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginWithOTP;
