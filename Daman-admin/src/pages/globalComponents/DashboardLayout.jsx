import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../assets/damanheaderlogo.png";
import LogoutButton from "./LogoutBtn";
import SidebarMenuItem from "./SidebarMenuItem";
import { useAuth } from "../../context/authContext";
import OrdersDropdown from "./OrdersDropdown";

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const location = useLocation();

  const toggleMenu = (menu) => setOpenMenu(openMenu === menu ? null : menu);
  const isActive = (path) => location.pathname === path;
  const { user } = useAuth();

  const menuItems = [
    // {
    //   label: "Home",
    //   menuKey: "home",
    //   links: [
    //     { to: "/SlidersList", text: "Sliders" },
    //     { to: "/categories", text: "Categories" },
    //     { to: "/products", text: "Products" },
    //   ],
    //   roles: ["Admin", "CXTeam"],
    // },
    {
      label: "Dashboard",
      to: "/dashboard", // Direct link (no dropdown)
      roles: ["Admin"],
    },
    {
      label: "Marquee",
      to: "/marquee", // Direct link (no dropdown)
      roles: ["Admin"],
    },
    {
      label: "Sliders",
      to: "/SlidersList",
      roles: ["Admin"],
    },
    {
      label: "Categories",
      to: "/categories",
      roles: ["Admin"],
    },
    {
      label: "Home Sections",
      to: "/homeSectionList",
      roles: ["Admin"],
    },
    {
      label: "Products",
      to: "/products",
      roles: ["Admin"],
    },
    // {
    //   label: "Settings",
    //   menuKey: "Setting",
    //   links: [{ to: "/pincodesList", text: "Pincodes" }],
    //   roles: ["Admin"],
    // },
    {
      label: "Abandoned Carts List",
      to: "/cartlist", // Direct link (no dropdown)
      roles: ["Admin"],
    },
    {
      label: "Admins",
      to: "/admins", // Direct link (no dropdown)
      roles: ["Admin"],
    },
    {
      label: "Customers",
      to: "/customers", // Direct link (no dropdown)
      roles: ["Admin"],
    },
    {
      label: "Delivery Charges",
      to: "/delivery-charges", // Direct link (no dropdown)
      roles: ["Admin"],
    },
    {
      label: "Store Management",
      to: "/store-list", // Direct link (no dropdown)
      roles: ["Admin"],
    },
    {
      label: "All Orders",
      to: "/AllOrders", // Direct link (no dropdown)
      roles: ["Admin"],
    },
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(user?.role)
  );
  return (
    <div className="flex h-screen ">
      {/* Sidebar */}
      <div
        className={`fixed z-50 inset-y-0 left-0 overflow-scroll no-scrollbar w-64 bg-gray-900 text-white p-4 transform transition-transform duration-300 md:relative md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-64"
        }`}
      >
        <div className="flex justify-between items-center mb-4 md:hidden">
          <Link to="/dashboard">
            <img src={Logo} alt="logo" className="w-1/2" />
          </Link>

          <button onClick={() => setIsSidebarOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>
        <Link to="/dashboard" className="hidden md:flex justify-center mb-4">
          <img src={Logo} alt="logo" className=" h-20" />
        </Link>

        {/* Navigation */}
        <nav>
          <ul className="flex flex-col mt-4 space-y-1">
            {filteredMenuItems.map((item, index) => (
              <SidebarMenuItem
                key={index}
                {...item}
                openMenu={openMenu}
                toggleMenu={toggleMenu}
                isActive={isActive}
                closeSidebar={setIsSidebarOpen}
              />
            ))}
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <button onClick={() => setIsSidebarOpen(true)} className="md:hidden">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-[0.7rem] md:text-xl font-bold">
            {user?.name
              ? `Welcome, ${
                  user.name.length > 25
                    ? user.name.slice(0, 25) + "..."
                    : user.name
                }`
              : "Dashboard"}
          </h1>
          <LogoutButton></LogoutButton>
        </header>

        {/* Content */}
        <main className="p-4 flex-1 bg-gray-100 overflow-auto pb-10">
          {children}
          <OrdersDropdown />
        </main>
      </div>
    </div>
  );
}
