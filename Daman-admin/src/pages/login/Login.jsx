import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import loginImage from "../../assets/bannerimage3.png"; // Replace with your actual image path
import Logo from "../../assets/damanheaderlogo.png";
import { message } from "antd";
import { useAuth } from "../../context/authContext";
import api from "../../utils/api";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Optional: to display error messages
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/dashboard";
  useEffect(() => {
    if (user) {
      // redirect to intended page if available
      navigate(location.state?.from?.pathname || "/dashboard", {
        replace: true,
      });
    }
  }, [user, navigate, location.state?.from]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      // Replace the URL with your actual API endpoint
      const response = await api.post(`/api/damanorganic/adminuserlogin`, {
        email,
        password,
      });

      // Assuming your API returns user data including role and token
      if (response.data.code === 200) {
        const userData = response.data.data;
        login({ ...userData, role: "Admin" });
        // Navigate based on the user's role
        if (userData) {
          console.log(from, "from");
          navigate(from, { replace: true });
          message.success("Login Successfull");
        }
      }
    } catch (error) {
      message.error(error.response.data.message || "Login error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Side - Image */}
      <div className="relative hidden md:block w-1/2">
        {/* Background Overlay */}
        <div className="absolute inset-0  bg-opacity-20"></div>

        <img
          src={loginImage}
          alt="Login"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 flex flex-col  items-center justify-center p-6 bg-white">
        <img src={Logo} alt="logo" className=" w-[100%] max-w-[200px] mb-5" />
        <div className=" max-w-md w-full bg-primary p-8 shadow-lg rounded-lg">
          <h2 className="text-2xl font-semibold text-center mb-6 text-white">
            Login
          </h2>

          {/* Optional: Display error message */}
          {error && <p className="mb-4 text-red-500 text-center">{error}</p>}

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-[#fff] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fff]"
              required
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-[#fff] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fff]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 "
              >
                {showPassword ? (
                  <FiEyeOff size={20} className="text-black" />
                ) : (
                  <FiEye size={20} className="text-black" />
                )}
              </button>
            </div>
            <button
              disabled={loading}
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#F3662E] to-[#EE3C24] text-white rounded-lg hover:opacity-90 transition justify-center flex items-center gap-5"
            >
              {loading ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
