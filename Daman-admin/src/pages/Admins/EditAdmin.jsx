import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import CustomButton from "../globalComponents/CustomButton";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  clearAdminDetails,
  fetchAdminById,
  updateAdmin,
} from "../../redux/slices/adminSlice";
import ErrorComponent from "../../components/ErrorComponent";
import Loader from "../../components/Loader";

const EditAdmin = () => {
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const {
    adminDetails,
    loading: adminLoading,
    error,
  } = useSelector((store) => store.admins);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fetch admin data when component mounts
  useEffect(() => {
    dispatch(fetchAdminById(id));

    return () => {
      dispatch(clearAdminDetails());
    };
  }, [id, dispatch]);

  // Set form values when adminDetails is available
  useEffect(() => {
    if (adminDetails) {
      setValue("name", adminDetails.name);
      setValue("gender", adminDetails.gender);
      setValue("countryCode", adminDetails.country_code);
      setValue("phone", adminDetails.phone);
      setValue("address", adminDetails.Address);
      setValue("email", adminDetails.email);
      // Note: Typically you wouldn't pre-fill password in edit forms
    }
  }, [adminDetails, setValue]);

  // Function to submit updated admin details
  const submitAdminDetails = async (data) => {
    try {
      setLoading(true);

      dispatch(
        updateAdmin({
          id,
          navigate,
          setLoading,
          updatedData: {
            name: data.name,
            gender: data.gender,
            country_code: data.countryCode,
            phone: data.phone,
            Address: data.address,
            email: data.email,
            // Only include password if it was changed
            ...(data.password && { password: data.password }),
          },
        })
      );
    } catch (error) {
      alert(error.message || "Something went wrong!");
      setLoading(false);
    }
  };
  if (adminLoading) return <Loader />;
  if (error) return <ErrorComponent message={error} />;
  return (
    <div className="form-container">
      <h2 className="form-title">Edit Admin</h2>

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

        {/* Password Field (optional for edit) */}
        <div>
          <label className="form-label">
            New Password (leave blank to keep current)
          </label>
          <input
            type="password"
            {...register("password", {
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            className="form-input"
            placeholder="Enter new password"
          />
          {errors.password && (
            <p className="form-error-text">{errors.password.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <CustomButton
            label={loading ? "Updating..." : "Update Admin"}
            variant="save"
            loading={loading}
          />
        </div>
      </form>
    </div>
  );
};

export default EditAdmin;
