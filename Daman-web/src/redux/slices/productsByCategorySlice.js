import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { message } from "antd";

// Async thunk to fetch products by category
export const fetchProductsByCategory = createAsyncThunk(
  "productsByCategory/fetch",
  async ({ categoryId, page }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/api/damanorganic/products_by_category/${categoryId}?page=${page}`
      );
      if (response.data.code === 200) {
        return response.data.data;
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

const initialState = {
  products: [],
  loading: false,
  error: null,
  page: 1,
  totalPages: 1,
};

const productByCategorySlice = createSlice({
  name: "productsByCategory",
  initialState,
  reducers: {
    clearProducts: (state) => {
      state.products = [];
      state.error = null;
      state.page = 1;
      state.totalPages = 1;
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
        const { results, page, totalPages } = action.payload;

        if (page === 1) {
          state.products = results; // First load
        } else {
          state.products = [...state.products, ...results]; // Append more
        }

        state.page = page;
        state.totalPages = totalPages;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProducts } = productByCategorySlice.actions;
export default productByCategorySlice.reducer;
