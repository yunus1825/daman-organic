import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import api from "../../utils/api";
import { message } from "antd";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchHomeSectionById,
  updateHomeSection,
} from "../../redux/slices/homeSectionSlice";
import { useNavigate, useParams } from "react-router-dom";
import CustomButton from "../globalComponents/CustomButton";
import Loader from "../../components/Loader";
import ErrorComponent from "../../components/ErrorComponent";

const EditSection = () => {
  const [productData, setProductData] = useState([]);
  const [productLoading, setProductLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const dispatch = useDispatch();
  const { sectionDetails, loading, error } = useSelector(
    (store) => store.homeSections
  );
  const { id } = useParams();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  useEffect(() => {
    if (
      sectionDetails?.section_name &&
      sectionDetails?.products?.length > 0 &&
      productData.length > 0
    ) {
      setValue("title", sectionDetails.section_name);

      const defaultProducts = sectionDetails.products.map((product) => {
        const matched = productData.find((p) => p._id === product.productId);
        return {
          label: matched?.prd_Name || product.prd_Name || "Unnamed Product",
          value: {
            productId: product.productId,
            productName:
              matched?.prd_Name || product.prd_Name || "Unnamed Product",
          },
        };
      });

      setSelectedProducts(defaultProducts);
    }
  }, [sectionDetails, productData]);
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
    if (!productData.length) getProducts();
  }, []);

  useEffect(() => {
    if (id) dispatch(fetchHomeSectionById(id));
  }, [id]);

  const onSubmit = async (data) => {
    try {
      if (selectedProducts.length === 0) {
        message.error("Please select at least one product.");
        return;
      }

      const productsArray = selectedProducts.map((item) => ({
        productId: item.value.productId,
      }));

      await dispatch(
        updateHomeSection({
          id,
          setLoading: setSubmitLoading,
          updatedData: {
            section_name: data.title,
            products: productsArray,
          },
          navigate,
        })
      );
    } catch (error) {
      console.error("Update failed:", error);
      message.error("Something went wrong. Please try again.");
    }
  };
  if (loading || productLoading) return <Loader />;
  if (error) return <ErrorComponent message={error} />;
  return (
    <div className="p-4 mx-auto form-container">
      <h2 className="form-title">Edit Section</h2>
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
            value={selectedProducts}
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

export default EditSection;
