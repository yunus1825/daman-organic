// redux/marqueeSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { message } from "antd"; // optional, for UI notifications
import api from "../../utils/api";

// Async Thunks
export const fetchMarquees = createAsyncThunk(
  "marquee/fetchMarquees",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/damanorganic/marquee");
      if (res.data.success) {
        return res.data.data; // now data contains the array of marquees
      } else {
        throw new Error(res.data.message || "Failed to fetch marquees");
      }
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Slice
const marqueeSlice = createSlice({
  name: "marquee",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchMarquees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMarquees.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMarquees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default marqueeSlice.reducer;
