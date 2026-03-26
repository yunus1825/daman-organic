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
  clearSliderDetails,
  fetchSliderById,
  updateSlider,
} from "../../redux/slices/sliderSlice";

const EditSlider = () => {
  const { id } = useParams(); // Get brand ID from URL
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState(null);
  const { sliderDetails, loading, error } = useSelector(
    (store) => store.sliders
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
    if (!sliderDetails) {
      dispatch(fetchSliderById(id)); // Fetch data if not already in store
    } else {
      setValue("title", sliderDetails?.Tittle || "");
      setValue("image", sliderDetails?.Image || "");
      setValue("description", sliderDetails?.Description || "");
    }
  }, [id, sliderDetails, dispatch, setValue]);
  useEffect(() => {
    return () => {
      dispatch(clearSliderDetails());
    };
  }, []);
  // Handle image selection
  const handleImageSelect = (file) => {
    if (file) {
      setSelectedImage(file);
      setValue("image", file, { shouldValidate: true });
    }
  };
  const submitUpdatedSlider = async (data) => {
    try {
      dispatch(
        updateSlider({
          id,
          navigate,
          updatedData: {
            Tittle: data.title,
            Description: data.description,
            file: selectedImage,
            image: data.image,
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

      <form onSubmit={handleSubmit(submitUpdatedSlider)} className="space-y-4">
        {/* Title Field */}
        <div>
          <label className="form-label">Title</label>
          <input
            type="text"
            {...register("title")}
            className="form-input"
            placeholder="Enter Slider title"
          />
        </div>

        <div>
          <label className="form-label">Description</label>
          <input
            type="text"
            {...register("description")}
            className="form-input"
            placeholder="Enter brand Description"
          />
        </div>

        {/* Image Uploader */}
        <div>
          <label className="form-label">Upload Image</label>
          <ImageUploader
            imageUrl={sliderDetails?.Image}
            onImageSelect={handleImageSelect}
          />
          <input
            type="hidden"
            {...register("image", { required: "Image is required" })}
          />
          {errors.image && (
            <p className="form-error-text">{errors.image.message}</p>
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

export default EditSlider;
