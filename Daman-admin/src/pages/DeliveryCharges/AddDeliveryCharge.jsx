import React, { useState } from "react";
import { useForm } from "react-hook-form";
import ImageUploader from "../globalComponents/ImageUploader";
import CustomButton from "../globalComponents/CustomButton";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addSlider } from "../../redux/slices/sliderSlice";
import { addDeliveryCharge } from "../../redux/slices/deliveryChargesSlice";
import { message } from "antd";

const AddDeliveryCharge = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  // Handle image selection

  const dispatch = useDispatch();
  // Function to submit brand details
  const submitDeliveyCharge = async (data) => {
    try {
      setLoading(true);

      dispatch(
        addDeliveryCharge({
          navigate,
          setLoading,
          chargeData: {
            tittle: data.title,
            kms: data.kms,
            charges: data.charges,
          },
        })
      );
    } catch (error) {
      message.error(error.message || "Something went wrong!");
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Add Delivey Charge</h2>

      <form
        onSubmit={handleSubmit((data) => {
          submitDeliveyCharge(data);
        })}
        className="space-y-4"
      >
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
            label={loading ? "Submitting..." : "Submit"}
            variant="save"
            loading={loading}
          />
        </div>
      </form>
    </div>
  );
};

export default AddDeliveryCharge;
