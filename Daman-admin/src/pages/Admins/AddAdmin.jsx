import React, { useState } from "react";
import { useForm } from "react-hook-form";
import CustomButton from "../globalComponents/CustomButton";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addAdmin } from "../../redux/slices/adminSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AddAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Function to submit admin details
  const submitAdminDetails = async (data) => {
    try {
      setLoading(true);

      dispatch(
        addAdmin({
          navigate,
          setLoading,
          adminData: {
            name: data.name,
            gender: data.gender,
            country_code: data.countryCode,
            phone: data.phone,
            Address: data.address,
            email: data.email,
            password: data.password,
          },
        })
      );
    } catch (error) {
      alert(error.message || "Something went wrong!");
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Add Admin</h2>

      <form
        onSubmit={handleSubmit((data) => {
          submitAdminDetails(data);
        })}
        className="space-y-4"
      >
        {/* Name Field */}
        <div>
          <label className="form-label">Full Name</label>
          <input
            type="text"
            {...register("name", {
              required: "Name is required",
            })}
            className="form-input"
            placeholder="Enter admin name"
          />
          {errors.name && (
            <p className="form-error-text">{errors.name.message}</p>
          )}
        </div>

        {/* Gender Field */}
        <div>
          <label className="form-label">Gender</label>
          <select
            {...register("gender", {
              required: "Gender is required",
            })}
            className="form-input"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && (
            <p className="form-error-text">{errors.gender.message}</p>
          )}
        </div>

        {/* Country Code and Phone */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label">Country Code</label>
            <input
              defaultValue={"+91"}
              type="text"
              {...register("countryCode", {
                required: "Country code is required",
              })}
              className="form-input"
              placeholder="+91"
            />
            {errors.countryCode && (
              <p className="form-error-text">{errors.countryCode.message}</p>
            )}
          </div>
          <div>
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Please enter a valid 10-digit phone number",
                },
              })}
              className="form-input"
              placeholder="8341413075"
            />
            {errors.phone && (
              <p className="form-error-text">{errors.phone.message}</p>
            )}
          </div>
        </div>

        {/* Address Field */}
        <div>
          <label className="form-label">Address</label>
          <textarea
            {...register("address", {
              required: "Address is required",
            })}
            className="form-input"
            placeholder="Enter full address"
            rows={3}
          />
          {errors.address && (
            <p className="form-error-text">{errors.address.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label className="form-label">Email</label>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            className="form-input"
            placeholder="user@gmail.com"
          />
          {errors.email && (
            <p className="form-error-text">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="relative">
          <label className="form-label">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            className="form-input pr-10"
            placeholder="Enter password"
          />
          <div
            className="absolute right-3 top-10 transform -translate-y-1/2 cursor-pointer text-gray-600"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
          {errors.password && (
            <p className="form-error-text">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="relative">
          <label className="form-label">Confirm Password</label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === watch("password") || "Passwords do not match",
            })}
            className="form-input pr-10"
            placeholder="Re-enter password"
          />
          <div
            className="absolute right-3 top-10 transform -translate-y-1/2 cursor-pointer text-gray-600"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
          {errors.confirmPassword && (
            <p className="form-error-text">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <CustomButton
            label={loading ? "Submitting..." : "Submit"}
            variant="save"
            loading={loading}
          />
        </div>
      </form>
    </div>
  );
};

export default AddAdmin;
