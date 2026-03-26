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
import { addProduct } from "../../redux/slices/productSlice";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const {
    categories,
    loading: categoryLoading,
    error: categoryError,
  } = useSelector((store) => store.category);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      image: null,
      images: [], // Start with one image slot
      variants: [],
      on_sale: false,
      discount: "",
      discount_type: "rupees",
    },
  });

  watch("images");

  const displayPrice = watch("display_price");
  const discount = watch("discount");
  const discountType = watch("discount_type");
  const onSale = watch("on_sale");

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "variants",
  });

  const images = getValues("images");

  const handleCategoryChange = (option) => {
    setValue("categoryId", option?.value?.categoryId);
    setValue("categoryName", option?.value?.categoryName);
  };

  const onSubmit = async (data) => {
    const mainImage = data.image || "";
    const multipleImages = Array.from(data.images || []).map((file) => file);

    // Process variants to ensure selling prices are set correctly
    const processedVariants = data.variants?.map((variant) => ({
      ...variant,
      selling_Price:
        variant.on_sale && variant.discount
          ? calculateVariantSellingPrice(variant)
          : variant.display_price, // If not on sale, selling price equals display price
    }));

    const payload = {
      ...data,
      image: mainImage,
      images: multipleImages,
      variants: processedVariants || [],
    };

    console.log("Product Payload =>", payload);

    dispatch(addProduct({ productData: payload, navigate, setLoading }));
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

  const addNewImage = () => {
    setValue("images", [...images, null], { shouldValidate: true });
  };

  const removeImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setValue("images", updatedImages, {
      shouldValidate: true,
    });
  };

  // Auto Calculation Logic

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

  // When On Sale turns OFF, clear discount:

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

    // Update display price
    setValue(`variants.${index}.display_price`, value);

    // Auto-fill selling price with display price if not on sale or no discount
    if (!currentVariant.on_sale || !currentVariant.discount) {
      setValue(`variants.${index}.selling_Price`, value);
    }
  };

  // Handle variant on sale toggle
  const handleVariantOnSaleToggle = (index, currentValue) => {
    const newValue = !currentValue;
    setValue(`variants.${index}.on_sale`, newValue);

    if (!newValue) {
      // When turning off sale, clear discount
      setValue(`variants.${index}.discount`, "");

      // Reset selling price to display price
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

    // Calculate selling price if on sale and both display price and discount exist
    if (updatedVariant.on_sale && updatedVariant.display_price && value) {
      const sellingPrice = calculateVariantSellingPrice(updatedVariant);
      setValue(`variants.${index}.selling_Price`, sellingPrice);
    }
  };

  if (categoryLoading) return <Loader />;
  if (categoryError) return <ErrorComponent message={categoryError} />;
  return (
    <div className="form-container" style={{ maxWidth: "1200px" }}>
      <h2 className="form-title">Add Product</h2>

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
                  message: "Display price must be greater than 0",
                },
                validate: (value) =>
                  value > 0 || "Display price must be greater than 0",
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
                  message: "Selling price must be greater than 0",
                },
                validate: (value) =>
                  value > 0 || "Selling price must be greater than 0",
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
              <label className="form-label ">Discount</label>

              <div className="grid grid-cols-5">
                <input
                  type="number"
                  {...register("discount", {
                    min: {
                      value: 1,
                      message: "Discount must be greater than 0",
                    },
                  })}
                  className="form-input  no-spinner w-full !rounded-r-none col-span-4"
                  placeholder="Enter discount"
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
                      {...register("discount_type")}
                      className="hidden peer"
                      defaultChecked
                    />
                    <p className="px-2 py-1 rounded-sm flex items-center justify-center peer-checked:!bg-primary peer-checked:text-amber-50">
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
                    <p className="px-2 py-1 rounded-sm flex  items-center justify-center peer-checked:!bg-primary peer-checked:text-amber-50">
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
                  message: "UOM must be greater than 0",
                },
                validate: (value) => value > 0 || "UOM must be greater than 0",
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

          <Controller
            control={control}
            name={`image`}
            rules={{ required: "Image is required" }}
            render={({ field }) => (
              <ImageUploader
                onImageSelect={(file) => {
                  field.onChange(file);
                  handleImageSelect(file);
                }}
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
          <div className="grid grid-cols-2 gap-4">
            {images?.map((image, index) => (
              <div key={index} className="relative">
                <Controller
                  control={control}
                  name={`images.${index}`}
                  rules={{ required: "Image is required" }}
                  render={({ field }) => (
                    <ImageUploader
                      onImageSelect={(file) => {
                        field.onChange(file);
                        handleMultipleImageSelect(file, index);
                      }}
                      imageUrl={image ? URL.createObjectURL(image) : null}
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
        <div className="">
          {fields?.length > 0 && (
            <div className="flex justify-center">
              <p className="form-title text-center">Variants</p>
            </div>
          )}
          {fields?.map((item, index) => {
            const variantOnSale = watch(`variants.${index}.on_sale`);
            return (
              <div key={item.id} className=" form-variant-container">
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
                          message: "UOM must be greater than 0",
                        },
                        validate: (value) =>
                          value > 0 || "UOM must be greater than 0",
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
                          message: "Display Price must be greater than 0",
                        },
                        validate: (value) =>
                          value > 0 || "Display Price must be greater than 0",
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
            label={loading ? "Submitting..." : "Submit"}
            variant="save"
            loading={loading}
          />
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
