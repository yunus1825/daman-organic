import React, { useState } from "react";
import { useForm } from "react-hook-form";
import ImageUploader from "../globalComponents/ImageUploader";
import CustomButton from "../globalComponents/CustomButton";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addSlider } from "../../redux/slices/sliderSlice";

const AddSlider = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  // Handle image selection
  const handleImageSelect = (file) => {
    if (file) {
      setSelectedImage(file);
      setValue("image", file, { shouldValidate: true });
    }
  };

  const dispatch = useDispatch();
  // Function to submit brand details
  const submitSliderDetails = async (data) => {
    try {
      setLoading(true);

      // Validate image selection
      if (!selectedImage) {
        setValue("image", null);
        trigger("image");
        setLoading(false);
        return;
      }
      dispatch(
        addSlider({
          navigate,
          setLoading,
          sliderData: {
            Tittle: data.title,
            Description: data.description,
            file: selectedImage,
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
      <h2 className="form-title">Add Slider</h2>

      <form
        onSubmit={handleSubmit((data) => {
          submitSliderDetails(data);
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
            placeholder="Enter brand title"
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
          <ImageUploader onImageSelect={handleImageSelect} />
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
            label={loading ? "Submitting..." : "Submit"}
            variant="save"
            loading={loading}
          />
        </div>
      </form>
    </div>
  );
};

export default AddSlider;
