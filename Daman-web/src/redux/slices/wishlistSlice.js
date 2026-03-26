// wishlistSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { message } from "antd";

// Async thunk to toggle wishlist item
export const addWishlistItem = createAsyncThunk(
  "wishlist/addWishlistItem",
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const response = await api.put("/api/damanorganic/add_wishlist", {
        userId,
        productId,
      });
      if (response.data.code === 200) {
        message.success(response.data.message || "Added from whishlist");
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to update wishlist");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    } finally {
    }
  }
);
export const removeWishlistItem = createAsyncThunk(
  "wishlist/removeItem",
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const response = await api.put("/api/damanorganic/remove_wishlist", {
        userId,
        productId,
      });

      if (response.data.code === 200) {
        message.success(response.data.message || "removed to whishlist");
        return response.data.data.productId; // Assuming this returns the productId
      }

      throw new Error(
        response.data.message || "Failed to remove wishlist item"
      );
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
// Async thunk to fetch wishlist
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetch",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/damanorganic/wishlist/${userId}`);
      if (response.data.code === 200) {
        return response.data.data.results; // Assuming this returns array of product IDs
      }
      throw new Error(response.data.message || "Failed to fetch wishlist");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Toggle wishlist item cases
      .addCase(addWishlistItem.pending, (state) => {
        state.error = null;
      })
      .addCase(addWishlistItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(addWishlistItem.rejected, (state, action) => {
        state.error = action.payload;
        message.error(action.payload);
      })

      // Remove wishlist item cases
      .addCase(removeWishlistItem.pending, (state) => {
        state.error = null;
      })
      .addCase(removeWishlistItem.fulfilled, (state, action) => {
        const removedProductId = action.payload;
        state.items = state.items.filter(
          (item) => item?.product?._id !== removedProductId
        );
      })
      .addCase(removeWishlistItem.rejected, (state, action) => {
        state.error = action.payload;
        message.error(action.payload);
      })

      // Fetch wishlist cases
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        message.error(action.payload);
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
