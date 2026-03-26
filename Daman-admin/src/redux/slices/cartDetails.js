// src/features/cart/cartSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { message } from "antd";

export const fetchCartItemById = createAsyncThunk(
  "cartDetails/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/damanorganic/cart_details/${id}`);
      if (response.data.code === 200) {
        return response.data.data.results;
      } else {
        message.error("Failed to fetch cart item");
        throw new Error("Failed to fetch cart item");
      }
    } catch (error) {
      message.error(error.response.data.message || "Failed to fetch cart item");
      return rejectWithValue(error.response.data.message);
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  cartItemDetails: [],
  totalItems: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: "cartDetails",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCartDetails: (state) => {
      state.cartItemDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // FETCH BY ID
      .addCase(fetchCartItemById.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(fetchCartItemById.fulfilled, (state, action) => {
        state.cartItemDetails = action.payload;
        state.loading = false;
      })
      .addCase(fetchCartItemById.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { clearError } = cartSlice.actions;
export default cartSlice.reducer;
