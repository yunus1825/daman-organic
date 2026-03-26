// src/features/categories/categorySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { message } from "antd";

export const fetchCategories = createAsyncThunk(
  "categories/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/damanorganic/category_list");
      if (response.data.code === 200) {
        return response.data.data.results;
      } else {
        throw new Error("failed to fetch categories");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "failed to fetch categories";
      message.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);




const initialState = {
  categories: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    // Clear error state if needed
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCategoryDetails } = categorySlice.actions;
export default categorySlice.reducer;
