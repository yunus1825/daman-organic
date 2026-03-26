import React from "react";
import RouterLink from "./RouterLink";
import footerlogo from "../../assets/images/damanfooterlogo.png";
import { motion } from "framer-motion";
import {
  FiFacebook,
  FiInstagram,
  FiLinkedin,
  FiYoutube,
  FiSend,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { IoMailOutline } from "react-icons/io5";
import { LuPhone } from "react-icons/lu";
import { GrMapLocation } from "react-icons/gr";
import { message } from "antd";
import api from "../../utils/api";
import { useForm } from "react-hook-form";
import { Info, Award, MapPin, Smartphone } from "lucide-react";
const Footer = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const submitForm = async (data) => {
    try {
      const response = await api.post(`/api/damanorganic/contactus_mail`, data);
      if (response.data.code === 200) {
        message.success(
          response.data.message || "Your message has been sent successfully."
        );
        reset(); // reset form after submit
      }
    } catch (error) {
      message.error(error.message || "Failed to submit message");
    }
  };

  return (
    <footer className="bg-primary text-white rounded-xl overflow-hidden w-[97%] mx-auto my-5">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Menu Section */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-3">Ask us</h3>
            <form
              className="flex flex-col space-y-2"
              onSubmit={handleSubmit(submitForm)}
            >
              {/* Name */}
              <motion.div
                className="flex flex-col"
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 400, damping: 12 }}
              >
                <input
                  type="text"
                  placeholder="Your Name"
                  className="flex-1 bg-primary bg-opacity-10 border-b border-gray border-opacity-20 py-1.5 text-sm focus:outline-none"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && (
                  <span className="text-red-500 text-xs mt-0.5">
                    {errors.name.message}
                  </span>
                )}
              </motion.div>

              {/* Email */}
              <motion.div
                className="flex flex-col"
                whileHover={{ scale: 1.01 }}
              >
                <input
                  type="email"
                  placeholder="Your Email"
                  className="flex-1 bg-primary bg-opacity-10 border-b border-gray border-opacity-20 py-1.5 text-sm focus:outline-none"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Enter a valid email",
                    },
                  })}
                />
                {errors.email && (
                  <span className="text-red-500 text-xs mt-0.5">
                    {errors.email.message}
                  </span>
                )}
              </motion.div>

              {/* Subject */}
              <motion.div
                className="flex flex-col"
                whileHover={{ scale: 1.01 }}
              >
                <input
                  type="text"
                  placeholder="Subject"
                  className="flex-1 bg-primary bg-opacity-10 border-b border-gray border-opacity-20 py-1.5 text-sm focus:outline-none"
                  {...register("subject", { required: "Subject is required" })}
                />
                {errors.subject && (
                  <span className="text-red-500 text-xs mt-0.5">
                    {errors.subject.message}
                  </span>
                )}
              </motion.div>

              {/* Message */}
              <motion.div
                className="flex flex-col"
                whileHover={{ scale: 1.01 }}
              >
                <textarea
                  placeholder="Your Message"
                  rows="2"
                  className="flex-1 bg-primary bg-opacity-10 border-b border-gray border-opacity-20 py-1.5 text-sm focus:outline-none resize-none"
                  {...register("message", { required: "Message is required" })}
                />
                {errors.message && (
                  <span className="text-red-500 text-xs mt-0.5">
                    {errors.message.message}
                  </span>
                )}
              </motion.div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="flex cursor-pointer items-center gap-1.5 bg-primaryDark text-white px-3 py-1.5 text-sm rounded-md hover:bg-opacity-90 transition-colors duration-300 self-start disabled:opacity-50"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span>{isSubmitting ? "Sending..." : "Send"}</span>
                <FiSend size={14} />
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Section */}
          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-semibold mb-6">Contact info</h3>
            <div className="space-y-3 text-base">
              <a
                href="tel:+917032033366"
                className="flex items-center gap-2 hover:text-primaryLight transition-colors duration-300"
              >
                <FaWhatsapp className="text-white" />
                +91 7032033366
              </a>
              <a
                href="tel:+917032033366"
                className="flex items-center gap-2 hover:text-primaryLight transition-colors duration-300"
              >
                <LuPhone className="text-white" />
                +91 7032033366
              </a>
              <a
                href="mailto:info@damanorganic.com"
                className="flex items-center gap-2 hover:text-primaryLight transition-colors duration-300"
              >
                <IoMailOutline className="text-white" />
                info@damanorganic.com
              </a>
              <p className="flex items-start gap-2 ">
                <GrMapLocation size={40} className="text-white" />
                Whole Organic Foods Limited, 8-2,684/a ground floor, rd no 12,
                NBT Nagar, Banjara Hills, Hyderabad, Telangana 500034, India...
              </p>
            </div>
          </motion.div>

          {/* Social Section */}
          <motion.div variants={itemVariants} className="flex flex-col ">
            <div>
              <h3 className="text-2xl font-semibold mb-3">Follow us on</h3>
              <div className="flex items-center gap-3">
                {[
                  {
                    Icon: FiFacebook,
                    link: "https://www.facebook.com/damanorganicliving",
                  },
                  {
                    Icon: FiInstagram,
                    link: "https://www.instagram.com/damanorganicliving/",
                  },
                  {
                    Icon: FiLinkedin,
                    link: "https://www.linkedin.com/company/damanorganic",
                  },
                  {
                    Icon: FiYoutube,
                    link: "https://www.youtube.com/@damanorganicliving8491",
                  },
                ].map(({ Icon, link }, idx) => (
                  <motion.p
                    key={idx}
                    className="inline-block bg-white bg-opacity-10 rounded-full hover:bg-opacity-20 transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ padding: 5 }}
                  >
                    <a href={link} target="_blank" rel="noopener noreferrer">
                      <Icon size={20} className="text-xl text-primaryDark" />
                    </a>
                  </motion.p>
                ))}
              </div>
              <p className="my-4">
                Stay up to date on the latest from Daman Organic!
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 items-center font-medium">
              <RouterLink
                to="/about"
                className="flex items-center gap-2 hover:text-primaryLight transition"
              >
                <Info size={20} />
                About Us
              </RouterLink>

              <RouterLink
                to="/certificates"
                className="flex items-center gap-2 hover:text-primaryLight transition"
              >
                <Award size={20} />
                Certificates
              </RouterLink>

              <RouterLink
                to="/stores"
                className="flex items-center gap-2 hover:text-primaryLight transition"
              >
                <MapPin size={20} />
                Store Locations
              </RouterLink>
              <RouterLink
                to="/installpwa"
                className="flex items-center gap-3 w-fit bg-white backdrop-blur-sm text-primaryDark px-4 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300  border border-white/20 hover:border-primaryLight/30 font-semibold group"
              >
                <Smartphone
                  size={20}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
                <span>Install App</span>
              </RouterLink>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="bg-primaryDark"
        style={{ padding: 10 }}
      >
        <div className="flex flex-wrap justify-center gap-10  max-w-7xl mx-auto">
          <RouterLink
            to={"/policy/terms"}
            className="text-lg hover:text-primaryLight transition-colors duration-300"
          >
            Terms & Conditions
          </RouterLink>
          <RouterLink
            to={"/policy/privacy"}
            className="text-lg hover:text-primaryLight transition-colors duration-300"
          >
            Privacy and Policy
          </RouterLink>
          <RouterLink
            to={"/policy/refund"}
            className="text-lg hover:text-primaryLight transition-colors duration-300"
          >
            Refund Policy
          </RouterLink>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
