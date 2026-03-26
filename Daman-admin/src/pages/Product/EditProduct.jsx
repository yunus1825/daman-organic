import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import CustomButton from "../globalComponents/CustomButton";
import ImageUploader from "../globalComponents/ImageUploader";
import { FiPlus } from "react-icons/fi";
import { fetchCategories } from "../../redux/slices/categorySlice";
import Loader from "../../components/Loader";
import ErrorComponent from "../../components/ErrorComponent";
import {
  updateProduct,
  fetchProductById,
  updateProductVariant,
} from "../../redux/slices/productSlice";
import { useNavigate, useParams } from "react-router-dom";
import { Switch, Tag } from "antd";

const EditProduct = () => {
  const dispatch = useDispatch();
  const { productId } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    getValues,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      image: null,
      images: [],
      variants: [],
      on_sale: false,
      discount: "",
      discount_type: "rupees",
    },
  });

  const {
    categories,
    loading: categoryLoading,
    error: categoryError,
  } = useSelector((store) => store.category);

  const {
    productDetails: product,
    loading: productLoading,
    error: productError,
  } = useSelector((store) => store.products);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProductById(productId));
  }, [dispatch, productId]);

  // useEffect(() => {
  //   if (product) {
  //     // Set initial form values once product data is loaded
  //     setValue("categoryId", product.categoryId);
  //     setValue("categoryName", product.categoryName);
  //     setValue("prd_Name", product.prd_Name);
  //     setValue("display_price", product.display_price);
  //     setValue("selling_price", product.selling_price);
  //     setValue("description", product.description);
  //     setValue("quantity", product.quantity);
  //     setValue("Type", product.Type);
  //     setValue("image", product.image);
  //     setValue("images", product.images);

  //     // Set variants if they exist
  //     if (product.variants && product.variants.length > 0) {
  //       setValue("variants", product.variants);
  //     }

  //     setInitialLoad(false);
  //   }
  // }, [product]);
  useEffect(() => {
    if (product) {
      reset({
        categoryId: product.categoryId,
        categoryName: product.categoryName,
        prd_Name: product.prd_Name,
        display_price: product.display_price,
        selling_price: product.selling_price,
        description: product.description,
        quantity: product.quantity,
        Type: product.Type,
        image: product.image,
        images: product.images || [],
        variants: product.variants || [],
        on_sale: product.on_sale || false,
        discount: product.discount || "",
        discount_type: product.discount_type || "rupees",
      });

      setInitialLoad(false);
    }
  }, [product, reset]);

  const navigate = useNavigate();

  watch("images");
  const displayPrice = watch("display_price");
  const discount = watch("discount");
  const discountType = watch("discount_type");
  const onSale = watch("on_sale");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const images = getValues("images");
  const handleCategoryChange = (option) => {
    setValue("categoryId", option?.value?.categoryId);
    setValue("categoryName", option?.value?.categoryName);
  };

  const onSubmit = async (data) => {
    const mainImage = data.image || product.image; // Use existing image if new one isn't provided

    const multipleImages =
      data.images.length > 0
        ? Array.from(data.images || []).map((file) => file)
        : product.images; // Use existing images if new ones aren't provided
    const processedVariants = data.variants?.map((variant) => ({
      ...variant,
      selling_Price:
        variant.on_sale && variant.discount
          ? calculateVariantSellingPrice(variant)
          : variant.selling_Price, // keep manual value
    }));
    const payload = {
      ...data,
      image: mainImage,
      images: multipleImages,
      variants: processedVariants || [],
    };

    dispatch(
      updateProduct({
        updatedData: payload,
        navigate,
        setLoading,
        id: productId,
      }),
    );
  };

  const handleImageSelect = (file) => {
    if (file) {
      setValue("image", file, { shouldValidate: true });
    }
  };

  const handleMultipleImageSelect = (file, index) => {
    if (file) {
      const newImages = [...images];
      newImages[index] = file;
      setValue("images", newImages, { shouldValidate: true });
    }
  };

  const handleProductVariantUpdateStatus = (variantIndex, stockStatus) => {
    dispatch(
      updateProductVariant({ productId: productId, variantIndex, stockStatus }),
    );
  };

  const addNewImage = () => {
    setValue("images", [...images, null], { shouldValidate: true });
  };

  const removeImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setValue("images", updatedImages, {
      shouldValidate: true,
    });
  };

  useEffect(() => {
    if (!displayPrice) return;

    if (!onSale) {
      setValue("selling_price", displayPrice);
      return;
    }

    if (!discount) {
      setValue("selling_price", displayPrice);
      return;
    }

    let selling = displayPrice;

    if (discountType === "percent") {
      selling = displayPrice - (displayPrice * discount) / 100;
    } else {
      selling = displayPrice - discount;
    }

    if (selling < 1) selling = 1;

    setValue("selling_price", Math.round(selling));
  }, [displayPrice, discount, discountType, onSale, setValue]);

  useEffect(() => {
    if (!onSale) {
      setValue("discount", "");
    }
  }, [onSale, setValue]);

  // Calculate selling price for a variant
  const calculateVariantSellingPrice = (variant) => {
    if (!variant.display_price) return variant.display_price || "";
    if (!variant.on_sale || !variant.discount) return variant.display_price;

    let selling = variant.display_price;

    if (variant.discount_type === "percent") {
      selling =
        variant.display_price -
        (variant.display_price * variant.discount) / 100;
    } else {
      selling = variant.display_price - variant.discount;
    }

    if (selling < 1) selling = 1;

    return Math.round(selling);
  };
  // Handle variant display price change
  const handleVariantDisplayPriceChange = (index, value) => {
    const currentVariant = getValues(`variants.${index}`) || {};

    setValue(`variants.${index}.display_price`, value);

    if (!currentVariant.on_sale || !currentVariant.discount) {
      setValue(`variants.${index}.selling_Price`, value);
    }
  };

  // Handle variant on sale toggle
  const handleVariantOnSaleToggle = (index, currentValue) => {
    const newValue = !currentValue;
    setValue(`variants.${index}.on_sale`, newValue);

    if (!newValue) {
      setValue(`variants.${index}.discount`, "");

      const displayPrice = getValues(`variants.${index}.display_price`);

      if (displayPrice) {
        setValue(`variants.${index}.selling_Price`, displayPrice);
      }
    }
  };

  // Handle variant discount change
  const handleVariantDiscountChange = (index, field, value) => {
    const currentVariant = getValues(`variants.${index}`) || {};
    const updatedVariant = { ...currentVariant, [field]: value };

    setValue(`variants.${index}.${field}`, value);

    if (updatedVariant.on_sale && updatedVariant.display_price && value) {
      const sellingPrice = calculateVariantSellingPrice(updatedVariant);
      setValue(`variants.${index}.selling_Price`, sellingPrice);
    }
  };

  if (categoryLoading || productLoading) return <Loader />;
  if (categoryError) return <ErrorComponent message={categoryError} />;
  if (productError) return <ErrorComponent message={productError} />;

  return (
    <div className="form-container" style={{ maxWidth: "1200px" }}>
      <h2 className="form-title">Edit Product</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Category Dropdown */}
        <div>
          <label className="form-label">Select Category</label>
          <Select
            options={categories?.map((category) => {
              return {
                label: category?.CategoryName,
                value: {
                  categoryId: category?._id,
                  categoryName: category?.CategoryName,
                },
              };
            })}
            onChange={handleCategoryChange}
            placeholder="Search & select category"
            isLoading={categoryLoading}
            isSearchable={true}
            defaultValue={
              product?.categoryId && product?.categoryName
                ? {
                    label: product.categoryName,
                    value: {
                      categoryId: product.categoryId,
                      categoryName: product.categoryName,
                    },
                  }
                : null
            }
          />
          <input
            type="hidden"
            {...register("categoryId", { required: "Category is required" })}
          />
          <input
            type="hidden"
            {...register("categoryName", { required: "Category is required" })}
          />
          {errors.categoryId && (
            <p className="form-error-text">{errors.categoryId.message}</p>
          )}
        </div>

        <div>
          <label className="form-label">Product Name</label>
          <input
            {...register("prd_Name", {
              required: "Product name is required",
              pattern: {
                value: /^[^/]+$/, // disallows "/"
                message: "Product name cannot contain '/'",
              },
            })}
            placeholder="Enter product name"
            className="form-input"
          />
          {errors.prd_Name && (
            <p className="form-error-text">{errors.prd_Name.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label">Display Price</label>
            <input
              type="number"
              {...register("display_price", {
                required: "Display price is required",
                min: {
                  value: 1,
                  message: "Display Price must be greater than 0",
                },
                validate: (value) =>
                  value > 0 || "Display Price must be greater than 0",
              })}
              placeholder="e.g. 70"
              className="form-input no-spinner"
              onWheel={(e) => e.target.blur()} // prevent mouse scroll
              onKeyDown={(e) => {
                if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                  e.preventDefault(); // disable arrow increment/decrement
                }
              }}
            />
            {errors.display_price && (
              <p className="form-error-text">{errors.display_price.message}</p>
            )}
          </div>
          <div>
            <label className="form-label">Selling Price</label>
            <input
              type="number"
              {...register("selling_price", {
                required: "Selling price is required",
                min: {
                  value: 1,
                  message: "Selling Price must be greater than 0",
                },
                validate: (value) =>
                  value > 0 || "Selling Price must be greater than 0",
              })}
              placeholder="e.g. 65"
              className="form-input no-spinner"
              onWheel={(e) => e.target.blur()} // prevent mouse scroll
              onKeyDown={(e) => {
                if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                  e.preventDefault(); // disable arrow increment/decrement
                }
              }}
            />
            {errors.selling_price && (
              <p className="form-error-text">{errors.selling_price.message}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 mt-3">
          <label className="form-label !mb-0">On Sale</label>

          <button
            type="button"
            onClick={() => setValue("on_sale", !onSale)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              onSale ? "bg-primary" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                onSale ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <input type="hidden" {...register("on_sale")} />

        {onSale && (
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div>
              <label className="form-label">Discount</label>

              <div className="grid grid-cols-5">
                <input
                  type="number"
                  {...register("discount", {
                    min: {
                      value: 1,
                      message: "Discount must be greater than 0",
                    },
                  })}
                  className="form-input no-spinner w-full !rounded-r-none col-span-4"
                  placeholder="Enter discount"
                  onWheel={(e) => e.target.blur()}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                      e.preventDefault();
                    }
                  }}
                />

                <div className="flex justify-around form-input !border-l-0 !rounded-l-none">
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      value="rupees"
                      {...register("discount_type")}
                      className="hidden peer"
                    />
                    <p className="px-2 py-1 rounded-sm peer-checked:bg-primary peer-checked:text-white">
                      ₹
                    </p>
                  </label>

                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      value="percent"
                      {...register("discount_type")}
                      className="hidden peer"
                    />
                    <p className="px-2 py-1 rounded-sm peer-checked:bg-primary peer-checked:text-white">
                      %
                    </p>
                  </label>
                </div>
              </div>

              {errors.discount && (
                <p className="form-error-text">{errors.discount.message}</p>
              )}
            </div>
          </div>
        )}

        <div>
          <label className="form-label">Description</label>
          <textarea
            {...register("description", {
              required: "Description is required",
            })}
            placeholder="Write product description"
            className="form-input"
            rows={3}
          />
          {errors.description && (
            <p className="form-error-text">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label">UOM</label>
            <input
              type="number"
              {...register("quantity", {
                required: "UOM is required",
                min: {
                  value: 1,
                  message: "UMO must be greater than 0",
                },
                validate: (value) => value > 0 || "UMO must be greater than 0",
              })}
              placeholder="e.g. 10"
              className="form-input no-spinner"
              onWheel={(e) => e.target.blur()} // prevent mouse scroll
              onKeyDown={(e) => {
                if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                  e.preventDefault(); // disable arrow increment/decrement
                }
              }}
            />
            {errors.quantity && (
              <p className="form-error-text">{errors.quantity.message}</p>
            )}
          </div>
          <div>
            <label className="form-label">Type</label>
            <input
              {...register("Type", { required: "Type is required" })}
              placeholder="e.g. GRMS/KG/Pieces"
              className="form-input"
            />
            {errors.Type && (
              <p className="form-error-text">{errors.Type.message}</p>
            )}
          </div>
        </div>

        {/* Single Image Upload */}
        <div>
          <label className="form-label">Main Image</label>
          <p className="text-sm text-gray-500 mb-2">
            {product?.image
              ? "Current image will be replaced if you upload a new one"
              : ""}
          </p>

          <Controller
            control={control}
            name={`image`}
            render={({ field }) => (
              <ImageUploader
                onImageSelect={(file) => {
                  field.onChange(file);
                  handleImageSelect(file);
                }}
                imageUrl={product?.image} // Show existing image
              />
            )}
          />

          {errors.image && (
            <p className="form-error-text">{errors.image.message}</p>
          )}
        </div>

        {/* Multiple Images Upload */}
        <div>
          <label className="form-label">Additional Images</label>
          <p className="text-sm text-gray-500 mb-2">
            {product?.images?.length > 0
              ? "Current images will be replaced if you upload new ones"
              : ""}
          </p>
          <div className="grid grid-cols-2 gap-4">
            {images?.map((image, index) => (
              <div key={index} className="relative">
                <Controller
                  control={control}
                  name={`images.${index}`}
                  render={({ field }) => (
                    <ImageUploader
                      onImageSelect={(file) => {
                        field.onChange(file);
                        handleMultipleImageSelect(file, index);
                      }}
                      imageUrl={image?.image ? image?.image : null}
                    />
                  )}
                />
                {errors?.images?.[index] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors?.images?.[index].message}
                  </p>
                )}
                <button
                  className="absolute text-[10px] -top-2 -right-2 bg-blue-500 h-5 w-5 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition"
                  onClick={() => removeImage(index)}
                  type="button"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          {/* Add Image Button */}
          <button
            type="button"
            className="mt-4 flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
            onClick={addNewImage}
          >
            <FiPlus className="mr-2" />
            Add Image
          </button>
        </div>

        {/* Variants Section */}
        <div>
          {fields?.length > 0 && (
            <div className="flex justify-center">
              <p className="form-title text-center">Variants</p>
            </div>
          )}
          {fields?.map((item, index) => {
            const variantOnSale = watch(`variants.${index}.on_sale`);
            return (
              <div key={item.id} className="form-variant-container">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                  <div className="flex flex-col">
                    <label
                      htmlFor={`variants.${index}.quantity`}
                      className="form-label"
                    >
                      UOM
                    </label>
                    <input
                      type="number"
                      {...register(`variants.${index}.quantity`, {
                        required: "UOM is required",
                        min: {
                          value: 1,
                          message: "UMO must be greater than 0",
                        },
                        validate: (value) =>
                          value > 0 || "UMO must be greater than 0",
                      })}
                      placeholder="UOM"
                      className="form-input no-spinner"
                      onWheel={(e) => e.target.blur()} // prevent mouse scroll
                      onKeyDown={(e) => {
                        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                          e.preventDefault(); // disable arrow increment/decrement
                        }
                      }}
                    />
                    {errors.variants?.[index]?.quantity && (
                      <p className="text-red-500 text-sm">
                        {errors.variants[index].quantity.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor={`variants.${index}.Type`}
                      className="form-label"
                    >
                      Type
                    </label>
                    <input
                      {...register(`variants.${index}.Type`, {
                        required: "Type is required",
                      })}
                      placeholder="e.g. GRMS/KG/Pieces"
                      className="form-input"
                    />
                    {errors.variants?.[index]?.Type && (
                      <p className="text-red-500 text-sm">
                        {errors.variants[index].Type.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor={`variants.${index}.description`}
                      className="form-label"
                    >
                      Description
                    </label>
                    <input
                      type="text"
                      {...register(`variants.${index}.description`, {
                        required: "Description is required",
                      })}
                      placeholder="Description"
                      className="form-input"
                    />
                    {errors.variants?.[index]?.description && (
                      <p className="text-red-500 text-sm">
                        {errors.variants[index].description.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                  <div className="flex flex-col">
                    <label
                      htmlFor={`variants.${index}.display_price`}
                      className="form-label"
                    >
                      Display Price
                    </label>
                    <input
                      type="number"
                      {...register(`variants.${index}.display_price`, {
                        required: "Display Price is required",
                        min: {
                          value: 1,
                          message: "Selling Price must be greater than 0",
                        },
                        validate: (value) =>
                          value > 0 || "Selling Price must be greater than 0",
                      })}
                      placeholder="Display Price"
                      className="form-input no-spinner"
                      onChange={(e) => {
                        const value = e.target.value;
                        register(`variants.${index}.display_price`).onChange(e);
                        handleVariantDisplayPriceChange(index, value);
                      }}
                      onWheel={(e) => e.target.blur()} // prevent mouse scroll
                      onKeyDown={(e) => {
                        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                          e.preventDefault(); // disable arrow increment/decrement
                        }
                      }}
                    />
                    {errors.variants?.[index]?.display_price && (
                      <p className="text-red-500 text-sm">
                        {errors.variants[index].display_price.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor={`variants.${index}.selling_Price`}
                      className="form-label"
                    >
                      Selling Price
                    </label>
                    <input
                      type="number"
                      {...register(`variants.${index}.selling_Price`, {
                        required: "Selling Price is required",
                        min: {
                          value: 1,
                          message: "Selling Price must be greater than 0",
                        },
                        validate: (value) =>
                          value > 0 || "Selling Price must be greater than 0",
                      })}
                      placeholder="Selling Price"
                      className="form-input no-spinner"
                      onWheel={(e) => e.target.blur()} // prevent mouse scroll
                      onKeyDown={(e) => {
                        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                          e.preventDefault(); // disable arrow increment/decrement
                        }
                      }}
                    />
                    {errors.variants?.[index]?.selling_Price && (
                      <p className="text-red-500 text-sm">
                        {errors.variants[index].selling_Price.message}
                      </p>
                    )}
                  </div>

                  {/* Variant On Sale Toggle */}
                  <div className="flex items-center gap-3">
                    <p className="form-label !-mb-2">On Sale</p>
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleVariantOnSaleToggle(index, variantOnSale)
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          variantOnSale ? "bg-primary" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            variantOnSale ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Variant Discount Fields */}
                {variantOnSale && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                    <div className="flex flex-col">
                      <label
                        htmlFor={`variants.${index}.discount`}
                        className="form-label"
                      >
                        Discount
                      </label>
                      <div className="grid grid-cols-4">
                        <input
                          type="number"
                          {...register(`variants.${index}.discount`, {
                            min: {
                              value: 1,
                              message: "Discount must be greater than 0",
                            },
                          })}
                          className="form-input no-spinner w-full !rounded-r-none col-span-3"
                          placeholder="Enter discount"
                          onChange={(e) => {
                            const value = e.target.value;
                            register(`variants.${index}.discount`).onChange(e);
                            handleVariantDiscountChange(
                              index,
                              "discount",
                              value,
                            );
                          }}
                          onWheel={(e) => e.target.blur()}
                          onKeyDown={(e) => {
                            if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                              e.preventDefault();
                            }
                          }}
                        />
                        <div className="flex !transform-none justify-around form-input !border-l-0 !rounded-l-none">
                          <label className="cursor-pointer">
                            <input
                              type="radio"
                              value="rupees"
                              {...register(`variants.${index}.discount_type`)}
                              className="hidden peer"
                              defaultChecked
                              onChange={(e) => {
                                register(
                                  `variants.${index}.discount_type`,
                                ).onChange(e);
                                handleVariantDiscountChange(
                                  index,
                                  "discount_type",
                                  e.target.value,
                                );
                              }}
                            />
                            <p className="px-2 py-1 rounded-sm flex items-center justify-center peer-checked:!bg-primary peer-checked:text-amber-50">
                              ₹
                            </p>
                          </label>
                          <label className="cursor-pointer">
                            <input
                              type="radio"
                              value="percent"
                              {...register(`variants.${index}.discount_type`)}
                              className="hidden peer"
                              onChange={(e) => {
                                register(
                                  `variants.${index}.discount_type`,
                                ).onChange(e);
                                handleVariantDiscountChange(
                                  index,
                                  "discount_type",
                                  e.target.value,
                                );
                              }}
                            />
                            <p className="px-2 py-1 rounded-sm flex items-center justify-center peer-checked:!bg-primary peer-checked:text-amber-50">
                              %
                            </p>
                          </label>
                        </div>
                      </div>
                      {errors.variants?.[index]?.discount && (
                        <p className="text-red-500 text-sm">
                          {errors.variants[index].discount.message}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-5 justify-between items-center">
                  <div className="flex gap-3 items-center">
                    <Switch
                      checked={item.inStock}
                      onChange={() =>
                        handleProductVariantUpdateStatus(index, !item.inStock)
                      }
                    />
                    {item.inStock ? (
                      <Tag color="green"> In Stock</Tag>
                    ) : (
                      <Tag color="red">Out of Stock</Tag>
                    )}
                  </div>
                </div>
                <div className="flex justify-center">
                  <CustomButton
                    label="Remove"
                    variant="cancel"
                    onClick={() => remove(index)}
                  />
                </div>
              </div>
            );
          })}

          <div className="flex justify-center items-center">
            <CustomButton
              label="+ Add Variant"
              variant="add"
              onClick={() =>
                append({
                  quantity: "",
                  Type: "",
                  selling_Price: "",
                  display_price: "",
                  description: "",
                })
              }
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <CustomButton
            label={loading ? "Updating..." : "Update Product"}
            variant="save"
            loading={loading}
          />
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
