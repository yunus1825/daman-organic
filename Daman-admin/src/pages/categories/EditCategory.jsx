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
  clearCategoryDetails,
  fetchCategoryById,
  updateCategory,
} from "../../redux/slices/categorySlice";

const EditCategory = () => {
  const { id } = useParams(); // Get brand ID from URL
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState(null);
  const { categoryDetails, loading, error } = useSelector(
    (store) => store.category
  );
  // Fetch brand details from Redux store
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    dispatch(fetchCategoryById(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (categoryDetails) {
      setValue("categoryName", categoryDetails.CategoryName || "");
      setValue("image", categoryDetails.Image || "");
      setValue("description", categoryDetails.Description || "");
    }
  }, [categoryDetails, setValue]);
  useEffect(() => {
    return () => {
      dispatch(clearCategoryDetails());
    };
  }, []);
  // Handle image selection
  const handleImageSelect = (file) => {
    if (file) {
      setSelectedImage(file);
      setValue("image", file, { shouldValidate: true });
    }
  };
  // Submit updated brand details
  const submitUpdatedCategory = async (data) => {
    try {
      dispatch(
        updateCategory({
          id,
          navigate,
          updatedData: {
            CategoryName: data.categoryName,
            Description: data.description,
            file: selectedImage,
            Image: data.image,
          },
        })
      );
    } catch (error) {
      message.error(`Failed to update brand : Something went wrong`);
    }
  };
  if (loading) return <Loader />;
  if (error) return <ErrorComponent message={error} />;
  if (!categoryDetails) return null;
  return (
    <div className="form-container">
      <h2 className="form-title">Edit Category</h2>

      <form
        onSubmit={handleSubmit(submitUpdatedCategory)}
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
            placeholder="Enter Category name"
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
          <ImageUploader
            imageUrl={categoryDetails?.Image}
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

export default EditCategory;
