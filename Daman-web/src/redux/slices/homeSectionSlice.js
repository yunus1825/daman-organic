// src/features/homeSection/homeSectionSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { message } from "antd";

export const fetchHomeSections = createAsyncThunk(
  "homeSections/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/damanorganic/home_section_list");
      if (response.data.code === 200) {
        return response.data.data.results;
      } else {
        throw new Error("Failed to fetch home sections");
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to fetch home sections"
      );
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  homeSections: [],
  loading: false,
  error: null,
};

const homeSectionSlice = createSlice({
  name: "homeSections",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH ALL
      .addCase(fetchHomeSections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomeSections.fulfilled, (state, action) => {
        state.loading = false;
        state.homeSections = action.payload;
      })
      .addCase(fetchHomeSections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = homeSectionSlice.actions;
export default homeSectionSlice.reducer;
