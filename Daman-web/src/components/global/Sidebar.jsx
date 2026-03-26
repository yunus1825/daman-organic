// Sidebar.tsx
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiUser,
  FiHome,
  FiList,
  FiHeart,
  FiShoppingCart,
  FiMapPin,
  FiPackage,
  FiLogOut,
} from "react-icons/fi";
import RouterLink from "./RouterLink";
import damanheaderlogo from "../../assets/images/damanheaderlogo.png";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/slices/authSlice";
import { FaAndroid, FaApple } from "react-icons/fa";
import { Smartphone } from "lucide-react";

const mainNavItems = [
  { name: "Home", path: "/", icon: <FiHome className="mr-3" /> },
  { name: "Categories", path: "/category", icon: <FiList className="mr-3" /> },
];

const userNavItems = [
  { name: "Wishlist", path: "/wishlist", icon: <FiHeart className="mr-3" /> },
  { name: "My Cart", path: "/cart", icon: <FiShoppingCart className="mr-3" /> },
  {
    name: "My Orders",
    path: "/profile/orders",
    icon: <FiPackage className="mr-3" />,
  },
  {
    name: "My Address",
    path: "/profile/address",
    icon: <FiMapPin className="mr-3" />,
  },
];

const Sidebar = ({ isOpen, onClose, isAuthenticated }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logout());
    navigate("/auth");
    window.location.reload();
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/35 bg-opacity-50 z-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed top-0 overflow-y-scroll left-0 h-full w-72 bg-white shadow-xl z-50"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", ease: "easeInOut" }}
          >
            <div className="p-5 border-b border-gray-200 flex justify-between items-center ">
              <img
                src={damanheaderlogo}
                alt="Website Logo"
                className="h-7 object-contain"
              />
              <button
                className="focus:outline-none p-1 rounded-full hover:bg-white/20 transition-colors"
                onClick={onClose}
              >
                <FiX className="text-xl text-white" />
              </button>
            </div>

            <div className="p-5 flex flex-col h-[calc(100%-68px)]">
              <div className="mb-6">
                {isAuthenticated ? (
                  <RouterLink to="/profile/cart" onClick={onClose}>
                    <button className="w-full py-3 px-4 cursor-pointer flex items-center text-white bg-primary hover:bg-primaryDark rounded-lg transition-colors shadow-sm">
                      <FiUser className="mr-3" />
                      <span>My Profile</span>
                    </button>
                  </RouterLink>
                ) : (
                  <RouterLink to="/auth">
                    <button className="w-full py-3 px-4 flex items-center text-white bg-primary hover:bg-primaryDark rounded-lg transition-colors shadow-sm">
                      <FiUser className="mr-3" />
                      <span>Login / Register</span>
                    </button>
                  </RouterLink>
                )}
              </div>

              <nav className="flex-1">
                <div className="mb-6">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-4">
                    Menu
                  </h3>
                  <ul className="space-y-1">
                    {mainNavItems.map((item) => (
                      <motion.li
                        key={item.name}
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <RouterLink to={item.path}>
                          <a className="flex items-center py-3 px-4 text-gray-700 hover:text-[--color-primary] hover:bg-gray-100 rounded-lg transition-colors">
                            {item.icon}
                            <span>{item.name}</span>
                          </a>
                        </RouterLink>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {isAuthenticated && (
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-4">
                      My Account
                    </h3>
                    <ul className="space-y-1">
                      {userNavItems.map((item) => (
                        <motion.li
                          key={item.name}
                          whileHover={{ x: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <RouterLink
                            onClick={() => {
                              onClose();
                            }}
                            to={item.path}
                          >
                            <a className="flex items-center py-3 px-4 text-gray-700 hover:text-[--color-primary] hover:bg-gray-100 rounded-lg transition-colors">
                              {item.icon}
                              <span>{item.name}</span>
                            </a>
                          </RouterLink>
                        </motion.li>
                      ))}
                      <motion.li
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        onClick={handleLogout}
                      >
                        <div className="flex cursor-pointer gap-3 items-center py-3 px-4 text-gray-700 hover:text-[--color-primary] hover:bg-gray-100 rounded-lg transition-colors">
                          <FiLogOut />
                          <span>Logout</span>
                        </div>
                      </motion.li>
                    </ul>
                  </div>
                )}
              </nav>

              <RouterLink to="/installpwa">
                <button className="w-full py-3 cursor-pointer px-4 flex items-center justify-center text-white bg-primary hover:bg-primaryDark rounded-lg transition-colors shadow-sm">
                  <Smartphone className="mr-3 w-5 h-5" />
                  <span>Install App</span>
                </button>
              </RouterLink>

              <div className="mt-auto pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  © {new Date().getFullYear()} Daman
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
