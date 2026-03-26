// redux/marqueeSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
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
      message.error(error.response?.data?.message || error.message);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addMarquee = createAsyncThunk(
  "marquee/addMarquee",
  async (text, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/damanorganic/marquee", { text });
      if (res.data.success) {
        return res.data.data;
      } else {
        throw new Error(res.data.message || "Failed to add marquee");
      }
    } catch (error) {
      message.error(error.response?.data?.message || error.message);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteMarquee = createAsyncThunk(
  "marquee/deleteMarquee",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/api/damanorganic/marquee/${id}`);
      if (res.data.success) {
        return id;
      } else {
        throw new Error(res.data.message || "Failed to delete marquee");
      }
    } catch (error) {
      message.error(error.response?.data?.message || error.message);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const toggleActive = createAsyncThunk(
  "marquee/toggleActive",
  async (marquee, { rejectWithValue }) => {
    try {
      const res = await api.put(`/api/damanorganic/marquee/${marquee._id}`, {
        text: marquee.text,
        isActive: !marquee.isActive,
      });
      if (res.data.success) {
        return res.data.data;
      } else {
        throw new Error(res.data.message || "Failed to update marquee");
      }
    } catch (error) {
      message.error(error.response?.data?.message || error.message);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const updateMarquee = createAsyncThunk(
  "marquee/updateMarquee",
  async ({ id, text, isActive }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/api/damanorganic/marquee/${id}`, {
        text,
        isActive,
      });
      if (res.data.success) {
        return res.data.data;
      } else {
        throw new Error(res.data.message || "Failed to update marquee");
      }
    } catch (error) {
      message.error(error.response?.data?.message || error.message);
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
      })

      // Add
      .addCase(addMarquee.pending, (state) => {
        state.error = null;
      })
      .addCase(addMarquee.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(addMarquee.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteMarquee.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteMarquee.fulfilled, (state, action) => {
        state.items = state.items.filter((m) => m._id !== action.payload);
      })
      .addCase(deleteMarquee.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Toggle Active
      .addCase(toggleActive.pending, (state) => {
        state.error = null;
      })
      .addCase(toggleActive.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (m) => m._id === action.payload._id
        );
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(toggleActive.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Update Marquee
      .addCase(updateMarquee.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (m) => m._id === action.payload._id
        );
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(updateMarquee.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default marqueeSlice.reducer;
