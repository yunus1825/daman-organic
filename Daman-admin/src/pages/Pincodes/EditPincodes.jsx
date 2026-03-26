import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ImageUploader from "../globalComponents/ImageUploader";
import CustomButton from "../globalComponents/CustomButton";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import Loader from "../../components/Loader";
import ErrorComponent from "../../components/ErrorComponent";
import { message } from "antd";
import { clearPincodeDetails, fetchPincodeById, updatePincodes } from "../../redux/slices/pincodesSlice";

const EditPincode = () => {
  const { id } = useParams(); // Get brand ID from URL
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { PincodeDetails, loading, error } = useSelector(
    (store) => store.pincodes
  );
  // Fetch brand details from Redux store
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm();

  // Fetch brand details when component mounts
  useEffect(() => {
    if (!PincodeDetails) {
      dispatch(fetchPincodeById(id)); // Fetch data if not already in store
    } else {
      setValue("city", PincodeDetails?.city || "");
      setValue("area", PincodeDetails?.area || "");
      setValue("pincode", PincodeDetails?.pincode || "");
    }
  }, [id, PincodeDetails, dispatch, setValue]);
  useEffect(() => {
    return () => {
      dispatch(clearPincodeDetails());
    };
  }, []);
 
  // Submit updated brand details
  const submitUpdatedBrand = async (data) => {
    try {
 

      dispatch(
        updatePincodes({
          id,
          navigate,
          updatedData: {
            city: data.city,
            area:data.area,
            pincode:data.pincode
          },
        })
      );
    } catch (error) {
      message.error(`Failed to update brand : Something went wrong`);
    }
  };
  if (loading) return <Loader />;
  if (error) return <ErrorComponent message={error} />;
  return (
    <div className="form-container">
      <h2 className="form-title">Edit Slider</h2>

      <form onSubmit={handleSubmit(submitUpdatedBrand)} className="space-y-4">
        {/* Title Field */}
        <div>
          <label className="form-label">City</label>
          <input
            type="text"
            {...register("city", { required: "City is required" })}
            className="form-input"
            placeholder="Enter Slider City"
          />
          {errors.city && (
            <p className="form-error-text">{errors.city.message}</p>
          )}
        </div>

        <div>
          <label className="form-label">Area</label>
          <input
            type="text"
            {...register("area", {
              required: "Area is required",
            })}
            className="form-input"
            placeholder="Enter brand Area"
          />
          {errors.area && (
            <p className="form-error-text">{errors.area.message}</p>
          )}
        </div>

        <div>
          <label className="form-label">Pincode</label>
          <input
            type="number"
            {...register("pincode", {
              required: "Area is required",
            })}
            className="form-input"
            placeholder="Enter brand pincode"
          />
          {errors.pincode && (
            <p className="form-error-text">{errors.pincode.message}</p>
          )}
        </div>
        

        {/* Submit Button */}
        <div className="flex justify-center">
          <CustomButton
            label={loading ? "Updating..." : "Update"}
            variant="save"
            loading={loading}
          />
        </div>
      </form>
    </div>
  );
};

export default EditPincode;
