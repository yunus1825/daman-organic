import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";

const ProtectedRoute = ({
  children,
  allowedRoles = [],
  allowAllAuthenticated = false,
}) => {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  //testing space
  // If allowAllAuthenticated is true, allow any logged-in user
  if (
    allowAllAuthenticated ||
    user.role === "Admin" ||
    allowedRoles.includes(user.role)
  ) {
    return children;
  }

  return <Navigate to="/" replace />;
};

export default ProtectedRoute;
