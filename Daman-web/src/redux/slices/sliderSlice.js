import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { message } from "antd";
import api from "../../utils/api";

// Fetch sliders
export const fetchSliders = createAsyncThunk(
  "sliders/fetchSliders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/damanorganic/slider_list`);
      if (response.data.code === 200) {
        return response.data.data.results;
      } else {
        message.error("Failed to fetch sliders: Something went wrong");
        throw new Error("Failed to fetch sliders");
      }
    } catch (error) {
      message.error("Failed to fetch sliders: Something went wrong");
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  sliders: [],
  loading: false,
  error: null,
};

const slidersSlice = createSlice({
  name: "sliders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSliders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSliders.fulfilled, (state, action) => {
        state.loading = false;
        state.sliders = action.payload;
      })
      .addCase(fetchSliders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export default slidersSlice.reducer;
