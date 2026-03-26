import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { message } from "antd";

// Async thunk to fetch products by category
export const fetchProductsByCategory = createAsyncThunk(
  "productsByCategory/fetch",
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/api/damanorganic/products_by_category/${categoryId}`
      );
      if (response.data.code === 200) {
        return response.data.data.results;
      } else {
        throw new Error("Failed to fetch products for this category");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch products by category";
      message.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateCategoryProductOrder = createAsyncThunk(
  "productsByCategory/updateCategoryOrder",
  async ({ id, reorderedProducts }) => {
    const orderedIds = {
      CategoryId: id,
      order_json: reorderedProducts.map((c, i) => ({
        ProductId: c._id,
        order: i,
      })),
    };
    console.log(orderedIds);
    const response = await api.put(
      "/api/damanorganic/products_updateorder",
      orderedIds
    );
    if (response.data.code === 200) {
      return response.data.data.results;
    } else {
      throw new Error("Failed to update product order");
    }
  }
);

const initialState = {
  products: [],
  loading: false,
  error: null,
};

const productByCategorySlice = createSlice({
  name: "productsByCategory",
  initialState,
  reducers: {
    clearProducts: (state) => {
      state.products = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Categories order
      .addCase(updateCategoryProductOrder.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(updateCategoryProductOrder.fulfilled, (state, action) => {
        state.products = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(updateCategoryProductOrder.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        state.error = null;
      });
  },
});

export const { clearProducts } = productByCategorySlice.actions;
export default productByCategorySlice.reducer;
