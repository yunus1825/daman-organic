import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ImageUploader from "../globalComponents/ImageUploader";
import CustomButton from "../globalComponents/CustomButton";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import Loader from "../../components/Loader";
import ErrorComponent from "../../components/ErrorComponent";
import { message } from "antd";
import {
  clearChargeDetails,
  fetchDeliveryChargeById,
  updateDeliveryCharge,
} from "../../redux/slices/deliveryChargesSlice";

const EditDeliveryCharge = () => {
  const { id } = useParams(); // Get brand ID from URL
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { chargeDetails, loading, error } = useSelector(
    (store) => store.deliveryCharges
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
    if (!chargeDetails) {
      dispatch(fetchDeliveryChargeById(id)); // Fetch data if not already in store
    } else {
      setValue("title", chargeDetails?.tittle || "");
      setValue("kms", chargeDetails?.kms || "");
      setValue("charges", chargeDetails?.charges || "");
    }
  }, [id, chargeDetails, dispatch, setValue]);

  useEffect(() => {
    return () => {
      dispatch(clearChargeDetails());
    };
  }, []);

  const submitUpdatedData = async (data) => {
    try {
      dispatch(
        updateDeliveryCharge({
          id,
          navigate,
          updatedData: {
            tittle: data.title,
            kms: data.kms,
            charges: data.charges,
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
      <h2 className="form-title">Edit Delivery Charge</h2>

      <form onSubmit={handleSubmit(submitUpdatedData)} className="space-y-4">
        {/* Title Field */}
        <div>
          <label className="form-label">Title</label>
          <input
            type="text"
            {...register("title")}
            className="form-input"
            placeholder="Enter  title"
          />
        </div>
        <div>
          <label className="form-label">Kms</label>
          <input
            type="number"
            {...register("kms")}
            className="form-input"
            placeholder="Enter Kms eg : 5"
          />
        </div>
        <div>
          <label className="form-label">charges</label>
          <input
            type="number"
            {...register("charges")}
            className="form-input"
            placeholder="Enter charges eg : 100"
          />
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

export default EditDeliveryCharge;
