import { FiLogOut } from "react-icons/fi"; // Import logout icon
import { useAuth } from "../../context/authContext";

const LogoutButton = () => {
  const { logout } = useAuth();

  return (
    <button
      onClick={logout}
      className="flex items-center gap-2 text-red-600 hover:text-red-700 transition"
    >
      <FiLogOut size={20} /> {/* Logout icon */}
      Logout
    </button>
  );
};

export default LogoutButton;
