// src/features/products/productSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { message } from "antd";
import { uploadImage } from "../Utils";

export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/damanorganic/product_list");
      if (response.data.code === 200) {
        return response.data.data.results;
      } else {
        throw new Error("Failed to fetch products");
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to fetch products"
      );
      return rejectWithValue(error.message);
    }
  }
);

export const addProduct = createAsyncThunk(
  "products/add",
  async ({ navigate, setLoading, productData }, { rejectWithValue }) => {
    try {
      setLoading(true);

      // Upload main image
      const mainImageUrl = await uploadImage(productData.image);

      // Upload additional images
      const additionalImages = await Promise.all(
        productData.images.map(async (file) => ({
          image: await uploadImage(file),
        }))
      );

      // Prepare request payload
      const payload = {
        categoryId: productData.categoryId,
        categoryName: productData.categoryName,
        prd_Name: productData.prd_Name,
        display_price: productData.display_price,
        selling_price: productData.selling_price,
        description: productData.description,
        image: mainImageUrl,
        quantity: productData.quantity,
        Type: productData.Type,
        variants: productData.variants,
        images: additionalImages,
      };

      // Send request
      const { data } = await api.post("/api/damanorganic/product_add", payload);

      // Handle response
      if (data.code === 200) {
        message.success("Product added successfully");
        navigate("/products");
        return data.data.results;
      } else {
        throw new Error(data.message || "Failed to add product");
      }
    } catch (error) {
      message.error(
        error?.response?.data?.message ||
          error.message ||
          "Failed to add product"
      );
      return rejectWithValue(error.message);
    } finally {
      setLoading(false);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, updatedData, navigate, setLoading }, { rejectWithValue }) => {
    try {
      setLoading(true);
      // Handle main image conditionally like additionalImages
      let mainImageUrl = updatedData.image;
      if (updatedData.image instanceof File) {
        mainImageUrl = await uploadImage(updatedData.image);
      }

      // Handle additional images
      const additionalImages = await Promise.all(
        updatedData.images.map(async (img) => {
          if (img instanceof File) {
            const uploadedUrl = await uploadImage(img);
            return { image: uploadedUrl };
          }
          return { image: img.image };
        })
      );

      // Prepare request payload
      const payload = {
        categoryId: updatedData.categoryId,
        categoryName: updatedData.categoryName,
        prd_Name: updatedData.prd_Name,
        display_price: updatedData.display_price,
        selling_price: updatedData.selling_price,
        description: updatedData.description,
        image: mainImageUrl,
        quantity: updatedData.quantity,
        Type: updatedData.Type,
        variants: updatedData.variants,
        images: additionalImages,
      };

      const response = await api.put(
        `/api/damanorganic/product_upd/${id}`,
        payload
      );

      if (response.data.code === 200) {
        navigate("/products");
        message.success("Successfully updated product");
        return response.data.data.results;
      } else {
        throw new Error("Failed to update product");
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to update product"
      );
      return rejectWithValue(error.message);
    } finally {
      setLoading(false);
    }
  }
);

export const updateProductVariant = createAsyncThunk(
  "products/updateProductVariant",
  async ({ productId, variantIndex, stockStatus }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/api/damanorganic/${productId}/variant/${variantIndex}/stock`,
        {
          inStock: stockStatus,
        }
      );
      if (response.data.code === 200) {
        message.success(response?.data?.message || "");
        return response.data.product;
      } else {
        throw new Error("Failed to update product variant");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to fetch product");
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/damanorganic/product_details/${id}`);
      if (response.data.code === 200) {
        return response.data.data.results;
      } else {
        throw new Error("Failed to fetch product");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to fetch product");
      return rejectWithValue(error.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/damanorganic/product_del/${id}`);
      if (response.data.code === 200) {
        return id;
      } else {
        throw new Error("Failed to delete product");
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to delete product"
      );
      return rejectWithValue(error.message);
    }
  }
);
// NEW: Update Product Stock
export const updateProductStock = createAsyncThunk(
  "products/updateStock",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const payload = { status }; // Adjust key name if API expects something else
      const response = await api.put(
        `/api/damanorganic/product_upd/${id}`,
        payload
      );

      if (response.data.code === 200) {
        message.success(
          `Product marked as ${status ? "In Stock" : "Out of Stock"}`
        );
        return response.data.data.results; // Return updated product
      } else {
        throw new Error(response.data.message || "Failed to update stock");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to update stock");
      return rejectWithValue(error.message);
    }
  }
);
export const updateProductVisibility = createAsyncThunk(
  "products/updateProductVisibility",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/damanorganic/prd_hide/${id}`);

      if (response.data.code === 200) {
        message.success(`Product updated succesfully`);
        return response.data.data.result; // Return updated product
      } else {
        throw new Error(response.data.message || "Failed to update stock");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to update stock");
      return rejectWithValue(error.message);
    }
  }
);
const initialState = {
  products: [],
  productDetails: {},
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearProductDetails: (state) => {
      state.productDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADD
      .addCase(addProduct.pending, (state) => {
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateProduct.pending, (state) => {
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) state.products[index] = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.error = action.payload;
      })

      // FETCH BY ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.productDetails = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteProduct.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p._id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.payload;
      })
      // UPDATE STOCK
      .addCase(updateProductStock.pending, (state) => {
        state.error = null;
      })
      .addCase(updateProductStock.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.products[index] = {
            ...state.products[index],
            ...action.payload, // Merge updated product fields
          };
        }
      })
      .addCase(updateProductStock.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Hide product
      .addCase(updateProductVisibility.pending, (state) => {
        state.error = null;
      })
      .addCase(updateProductVisibility.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.products[index] = {
            ...state.products[index],
            ...action.payload, // Merge updated product fields
          };
        }
      })
      .addCase(updateProductVisibility.rejected, (state, action) => {
        state.error = action.payload;
      })
      // update product variant stock status
      .addCase(updateProductVariant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProductVariant.fulfilled, (state, action) => {
        state.loading = false;
        state.productDetails = action.payload;
      })
      .addCase(updateProductVariant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearProductDetails } = productSlice.actions;
export default productSlice.reducer;
