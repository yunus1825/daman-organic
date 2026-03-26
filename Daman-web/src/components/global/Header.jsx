import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiMenu, FiHeart, FiShoppingCart, FiUser } from "react-icons/fi";
import damanheaderlogo from "../../assets/images/damanheaderlogo.png";
import RouterLink from "./RouterLink";
import { useSelector } from "react-redux";
import SearchInput from "./SearchInput";
import Sidebar from "./Sidebar";
import SearchInputMobile from "../../pages/Home/components/SearchInputMobile";
const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const { items: whishlistitems } = useSelector((state) => state.wishlist);

  const cartItems = useSelector((state) => state.cart.items);

  return (
    <header id="site-header" className={`bg-white  sticky shadow  top-0 z-50`}>
      <div className="px-2 md:px-4">
        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between py-4">
          {/* Left side - Menu icon and logo */}
          <div className="flex items-center space-x-6">
            {/* Three-line menu button with third line shorter */}
            <button
              className="flex flex-col space-y-1.5 w-8 cursor-pointer focus:outline-none"
              onClick={toggleSidebar}
              aria-label="Menu"
            >
              <motion.span
                className="h-1 rounded-2xl bg-primary w-full"
                initial={{ width: "100%" }}
                whileHover={{ width: "80%" }}
              />
              <motion.span
                className="h-1 rounded-2xl bg-primary w-full"
                initial={{ width: "100%" }}
                whileHover={{ width: "90%" }}
              />
              <motion.span
                className="h-1 rounded-2xl bg-primary w-4/5"
                initial={{ width: "80%" }}
                whileHover={{ width: "70%" }}
              />
            </button>

            {/* Logo */}
            <RouterLink to={"/"}>
              <motion.div
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src={damanheaderlogo} // Replace with your logo path
                  alt="Website Logo"
                  className="h-10 object-contain"
                />
              </motion.div>
            </RouterLink>
          </div>
          {/* Location Selector */}

          {/* <LocationModal></LocationModal> */}

          {/* Middle - Search bar */}
          <div className={`flex-1 max-w-xl mx-4 transition-all duration-300`}>
            {/* <motion.div className="relative flex justify-between items-center w-full py-2 px-1  rounded-sm border-2 border-gray-300">
              <input
                type="text"
                placeholder="Search for products..."
                className="flex-1 outline-0 pl-2"
              />
              <div className="p-1 rounded-[3px] bg-primaryDark">
                <FiSearch size={16} className=" text-white " />
              </div>
            </motion.div> */}
            <SearchInput></SearchInput>
          </div>

          {/* Right side - Location, wishlist, cart, login */}
          <div className="flex items-center space-x-4">
            {/* Icons */}
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Wishlist"
              >
                <RouterLink
                  to={"/wishlist"}
                  className="p-1.5 rounded-full  flex flex-col justify-center items-center"
                >
                  <div className="relative">
                    <FiHeart className="text-xl " />
                    {whishlistitems?.length > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-3 -right-3 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                      >
                        {whishlistitems?.length}
                      </motion.span>
                    )}
                  </div>

                  <p className="text-sm">Wishlist</p>
                </RouterLink>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Cart"
                className="relative" // Add relative positioning for the absolute badge
              >
                <RouterLink
                  to={"/cart"}
                  className="p-1.5 rounded-full flex flex-col justify-center items-center"
                >
                  <div className="relative">
                    <FiShoppingCart className="text-xl" />
                    {cartItems.length > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-3 -right-3 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                      >
                        {cartItems.length}
                      </motion.span>
                    )}
                  </div>
                  <p className="text-sm">Cart</p>
                </RouterLink>
              </motion.button>

              {isAuthenticated ? (
                <motion.button
                  className="p-1.5 rounded-full "
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Login"
                >
                  <RouterLink
                    to={"/profile/cart"}
                    className="p-1.5 rounded-full  flex flex-col justify-center items-center"
                  >
                    <FiUser className="text-xl " />
                    <p className="text-sm">Profile</p>
                  </RouterLink>
                </motion.button>
              ) : (
                <motion.button
                  className="p-1.5 rounded-full "
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Login"
                >
                  <RouterLink
                    to={"/auth"}
                    className="p-1.5 rounded-full  flex flex-col justify-center items-center"
                  >
                    <FiUser className="text-xl " />
                    <p className="text-sm">Log in</p>
                  </RouterLink>
                </motion.button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between py-2">
          <div className="flex items-center space-x-4">
            <button
              className="focus:outline-none"
              onClick={toggleSidebar}
              aria-label="Menu"
            >
              <FiMenu className="text-2xl text-[--color-primary]" />
            </button>
            <RouterLink to={"/"}>
              <img
                src={damanheaderlogo} // Replace with your logo path
                alt="Website Logo"
                className="h-6 object-contain"
              />
            </RouterLink>
          </div>

          <div className="flex items-center space-x-4">
            {/* Icons */}
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Wishlist"
              >
                <RouterLink
                  to={"/wishlist"}
                  className="p-1.5 rounded-full  flex flex-col justify-center items-center"
                >
                  <div className="relative">
                    <FiHeart className="text-xl " />
                    {whishlistitems?.length > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-3 -right-3 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                      >
                        {whishlistitems?.length}
                      </motion.span>
                    )}
                  </div>
                </RouterLink>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Cart"
                className="relative" // Add relative positioning for the absolute badge
              >
                <RouterLink
                  to={"/cart"}
                  className="p-1.5 rounded-full flex flex-col justify-center items-center"
                >
                  <div className="relative">
                    <FiShoppingCart className="text-xl" />
                    {cartItems.length > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-3 -right-3 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                      >
                        {cartItems.length}
                      </motion.span>
                    )}
                  </div>
                </RouterLink>
              </motion.button>

              {isAuthenticated ? (
                <motion.button
                  className="p-1.5 rounded-full "
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Login"
                >
                  <RouterLink
                    to={"/profile/cart"}
                    className="p-1.5 rounded-full  flex flex-col justify-center items-center"
                  >
                    <FiUser className="text-xl " />
                  </RouterLink>
                </motion.button>
              ) : (
                <motion.button
                  className="p-1.5 rounded-full "
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Login"
                >
                  <RouterLink
                    to={"/auth"}
                    className="p-1.5 rounded-full  flex flex-col justify-center items-center"
                  >
                    <FiUser className="text-xl " />
                  </RouterLink>
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="p-2 md:hidden">
        <SearchInputMobile></SearchInputMobile>
      </div>

      {/* Mobile Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        isAuthenticated={isAuthenticated}
      />
    </header>
  );
};

export default Header;
