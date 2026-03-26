import React, { useEffect, useState } from "react";
import {
  FiMapPin,
  FiLogOut,
  FiMenu,
  FiX,
  FiChevronRight,
  FiShoppingCart,
  FiPackage,
} from "react-icons/fi";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaRegHeart } from "react-icons/fa";
import UserCard from "../../../components/UserCard";
import { logout } from "../../../redux/slices/authSlice";

const navItems = [
  { name: "My Cart", icon: <FiShoppingCart />, key: "cart" },
  { name: "My Orders", icon: <FiPackage />, key: "orders" },
  { name: "My Wishlist", icon: <FaRegHeart />, key: "wishlist" },
  { name: "My Address", icon: <FiMapPin />, key: "address" },
  { name: "Logout", icon: <FiLogOut />, key: "logout" },
];

export default function ProfileLayout({ onSelect, children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tab } = useParams();
  const [active, setActive] = useState(tab || "details");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/auth");
    window.location.reload();
  };
  const handleSelect = (key) => {
    setActive(key);
    onSelect(key);
    navigate(`/profile/${key}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  useEffect(() => {
    handleSelect(tab);
  }, [tab]);

  const sidebarVariants = {
    hidden: { x: -300, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", damping: 25 },
    },
    exit: { x: -300, opacity: 0 },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <div className="flex flex-col md:flex-row  mx-auto min-h-[80vh] relative">
      {/* Mobile Overlay */}

      {/* <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          />
        )}
      </AnimatePresence> */}

      {/* Mobile Sidebar */}

      {/* <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-y-0 left-0 w-64 z-[999] md:hidden"
          >
            <div className="h-full bg-gradient-to-b from-white to-gray-50 backdrop-blur-lg bg-opacity-80 border-r border-gray-200 shadow-xl p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">My Account</h2>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX size={24} />
                </button>
              </div>
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <motion.button
                    key={item.key}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (item.key === "logout") {
                        handleLogout();
                      } else {
                        handleSelect(item.key);
                        setMobileMenuOpen(false);
                      }
                    }}
                    className={`
                      flex items-center justify-between w-full px-4 py-3 rounded-xl
                      ${
                        active === item.key
                          ? "bg-primary bg-opacity-10 text-white border border-primary border-opacity-20"
                          : "text-gray-700 hover:bg-gray-100"
                      }
                    `}
                  >
                    <div className="flex items-center">
                      <span
                        className={`mr-3 ${
                          active === item.key ? "text-primary" : "text-gray-500"
                        }`}
                      >
                        {item.icon}
                      </span>
                      {item.name}
                    </div>
                    <FiChevronRight className="text-gray-400" />
                  </motion.button>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence> */}
      {/* Mobile Header */}

      {/* <div className="md:hidden p-4 flex justify-between items-center sticky top-0 z-10 bg-white bg-opacity-80 backdrop-blur-sm border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">
          {navItems.find((item) => item.key === active)?.name || "Account"}
        </h2>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100"
        >
          <FiMenu size={20} />
        </button>
      </div> */}
      {/* desktop sidebar  */}
      <div className="hidden md:block w-full md:w-80 lg:w-96 p-4 sticky top-4 h-fit">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white bg-opacity-70 backdrop-blur-lg overflow-hidden rounded-lg border-2 border-gray-300 "
        >
          <UserCard />
          <nav className="space-y-3">
            {navItems.map((item) => (
              <motion.button
                key={item.key}
                onClick={() => {
                  if (item.key === "logout") {
                    handleLogout();
                  } else {
                    handleSelect(item.key);
                  }
                }}
                className={`
                  flex items-center cursor-pointer justify-between w-full px-4 py-3 
                  ${
                    active === item.key
                      ? "bg-primary bg-opacity-10 text-white  border border-opacity-20"
                      : " hover:bg-gray-50"
                  }
                `}
                style={{
                  background:
                    active === item.key &&
                    "linear-gradient(to right, rgba(06, 96, 156, 1) 40%, rgba(06, 96, 156, 0.3) 100%)",
                }}
              >
                <div className="flex items-center">
                  <span
                    className={`mr-3 ${
                      active === item.key ? "text-white" : ""
                    }`}
                  >
                    {item.icon}
                  </span>
                  {item.name}
                </div>
                <FiChevronRight
                  className={`font-bold ${
                    active === item.key ? "text-white" : "text-gray-400"
                  }} `}
                />
              </motion.button>
            ))}
          </nav>
        </motion.div>
      </div>
      <motion.main key={tab} className="w-full md:flex-1 p-4 md:p-4">
        {children}
      </motion.main>
      {/* Desktop Sidebar */}
    </div>
  );
}
