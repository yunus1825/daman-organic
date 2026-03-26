import React, { useState } from "react";
import { useForm } from "react-hook-form";
import ImageUploader from "../globalComponents/ImageUploader";
import CustomButton from "../globalComponents/CustomButton";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addCategory } from "../../redux/slices/categorySlice";

const AddCategory = () => {
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
  const submitBrandDetails = async (data) => {
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
        addCategory({
          navigate,
          setLoading,
          categoryData: {
            CategoryName: data.categoryName,
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
      <h2 className="form-title">Add Category</h2>

      <form
        onSubmit={handleSubmit((data) => {
          submitBrandDetails(data);
        })}
        className="space-y-4"
      >
        {/* Title Field */}
        <div>
          <label className="form-label">Category Name</label>
          <input
            type="text"
            {...register("categoryName", {
              required: "Category Name is required",
                pattern: {
                value: /^[^/]+$/, // disallows "/"
                message: "Category name cannot contain '/'",
              },
            })}
            className="form-input"
            placeholder="Enter category name"
          />
          {errors.categoryName && (
            <p className="form-error-text">{errors.categoryName.message}</p>
          )}
        </div>
        <div>
          <label className="form-label">Description</label>
          <input
            type="text"
            {...register("description", {
              required: "Description is required",
            })}
            className="form-input"
            placeholder="Enter brand Description"
          />
          {errors.description && (
            <p className="form-error-text">{errors.description.message}</p>
          )}
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

export default AddCategory;
