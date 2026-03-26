// cartSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { message } from "antd";

// Async thunk to add item to cart
export const addCartItem = createAsyncThunk(
  "cart/addItem",
  async ({ userId, productId, quantity, variantId }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/damanorganic/cart/${userId}`, {
        productId,
        quantity,
        variantId,
      });
      if (response.data.code === 200) {
        message.success(response.data.message || "Item added to cart");
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to add item to cart");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk to remove item from cart
export const removeCartItem = createAsyncThunk(
  "cart/removeItem",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/damanorganic/cart/${id}`);
      if (response.data.code === 200) {
        message.success(response.data.message || "Item removed from cart");
        return id;
      }
      throw new Error(
        response.data.message || "Failed to remove item from cart"
      );
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk to update cart item quantity
export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ userId, quantity, productId, variantId }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/damanorganic/cart/${userId}`, {
        userId,
        quantity,
        productId,
        variantId,
      });
      if (response.data.code === 200) {
        message.success(response.data.message || "Cart updated");
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to update cart");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk to fetch cart
export const fetchCart = createAsyncThunk(
  "cart/fetch",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/damanorganic/cart/${userId}`);
      if (response.data.code === 200) {
        return response.data.data.results;
      }
      throw new Error(response.data.message || "Failed to fetch cart");
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

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add item to cart cases
      .addCase(addCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCartItem.fulfilled, (state, action) => {
        state.loading = false;
        // Check if item already exists in cart
        const existingItemIndex = state.items.findIndex(
          (item) =>
            item._id === action.payload._id ||
            (item.productId === action.payload.productId &&
              item.variantId === action.payload.variantId)
        );

        if (existingItemIndex >= 0) {
          state.items[existingItemIndex] = action.payload;
        } else {
          state.items.push(action.payload);
        }
      })
      .addCase(addCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        message.error(action.payload);
      })

      // Remove item from cart cases
      .addCase(removeCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item._id !== action.payload);
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        message.error(action.payload);
      })

      // Update cart item quantity cases
      .addCase(updateCartItemQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.loading = false;
        const updatedItem = action.payload;
        const index = state.items.findIndex(
          (item) => item._id === updatedItem._id
        );
        if (index !== -1) {
          state.items[index] = updatedItem;
        }
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        message.error(action.payload);
      })

      // Fetch cart cases
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        message.error(action.payload);
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
