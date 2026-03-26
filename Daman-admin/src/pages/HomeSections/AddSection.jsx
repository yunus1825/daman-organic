import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import api from "../../utils/api";
import { message } from "antd";
import Select from "react-select";
import { useDispatch } from "react-redux";
import { addHomeSection } from "../../redux/slices/homeSectionSlice";
import { useNavigate } from "react-router-dom";
import CustomButton from "../globalComponents/CustomButton";

const AddSection = () => {
  const [productData, setProductData] = useState([]);
  const [productLoading, setProductLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const getProducts = async () => {
    try {
      setProductLoading(true);
      const response = await api.get("/api/damanorganic/product_drpdown_list");
      if (response.data.code === 200) {
        setProductData(response.data.data.results);
      } else {
        throw new Error("Failed to get products");
      }
    } catch (error) {
      message.error(error?.response?.data?.message || "Failed to get products");
    } finally {
      setProductLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const onSubmit = async (data) => {
    try {
      if (selectedProducts.length === 0) {
        message.error("Please select at least one product.");
        return;
      }

      setSubmitLoading(true);
      const productsArray = selectedProducts.map((item) => ({
        productId: item.value.productId,
        prd_Name: item.value.productName,
      }));

      await dispatch(
        addHomeSection({
          navigate,
          setLoading: setSubmitLoading,
          sectionData: {
            section_name: data.title,
            products: productsArray,
          },
        })
      );
    } catch (error) {
      console.error("Update failed:", error);
      message.error("Something went wrong. Please try again.");
    }
  };
  return (
    <div className="p-4 mx-auto form-container">
      <h2 className="form-title">Add Section</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="form-label block mb-1">Title</label>
          <input
            type="text"
            {...register("title", { required: "Title is required" })}
            className="form-input"
            placeholder="Enter title"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="form-label block mb-1">Select Products</label>
          <Select
            options={productData.map((product) => ({
              label: product.prd_Name,
              value: {
                productId: product._id,
                productName: product.prd_Name,
              },
            }))}
            placeholder="Search & select product"
            isLoading={productLoading}
            isSearchable
            isMulti
            onChange={(selected) => setSelectedProducts(selected || [])}
          />
        </div>

        <div className="flex justify-center">
          <CustomButton
            label={submitLoading ? "Submitting..." : "Submit"}
            variant="Add Section"
            loading={submitLoading}
          />
        </div>
      </form>
    </div>
  );
};

export default AddSection;
