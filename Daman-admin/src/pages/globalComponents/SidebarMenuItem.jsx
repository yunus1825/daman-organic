import { ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const SidebarMenuItem = ({
  label,
  menuKey,
  links,
  openMenu,
  toggleMenu,
  isActive,
  closeSidebar,
  to, // New prop to handle direct links
}) => (
  <li>
    {to ? (
      // Direct link
      <Link
        to={to}
        onClick={() => closeSidebar(false)}
        className={`flex justify-between items-center w-full p-2 rounded ${
          isActive(to) ? "bg-gray-500 text-white" : "hover:bg-gray-700"
        }`}
      >
        {label}
      </Link>
    ) : (
      // Dropdown button
      <>
        <button
          onClick={() => toggleMenu(menuKey)}
          className={`flex justify-between items-center w-full p-2 rounded ${
            openMenu === menuKey ? "bg-gray-700" : "hover:bg-gray-700"
          }`}
        >
          <span>{label}</span>
          {openMenu === menuKey ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        <motion.ul
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: openMenu === menuKey ? "auto" : 0,
            opacity: openMenu === menuKey ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          {links.map(({ to, text }) => (
            <Link
              key={to}
              to={to}
              onClick={() => closeSidebar(false)}
              className={`block ml-4 p-2 pl-6 rounded ${
                isActive(to) ? "bg-gray-500 text-white" : "hover:bg-gray-700"
              }`}
            >
              {text}
            </Link>
          ))}
        </motion.ul>
      </>
    )}
  </li>
);

export default SidebarMenuItem;
