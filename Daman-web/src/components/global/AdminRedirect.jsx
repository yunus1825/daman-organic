import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to external website
    window.location.href = "https://daman-organic-admin.web.app/";
  }, [navigate]);

  return null; // no UI needed
};

export default AdminRedirect;
