import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { message } from "antd";

// Fetch all orders
export const fetchOrders = createAsyncThunk(
  "orders/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/damanorganic/order_list");
      if (response.data.code === 200) {
        return response.data.data.results;
      } else {
        throw new Error("Failed to fetch orders");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to fetch orders");
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Fetch order by ID
export const fetchOrderById = createAsyncThunk(
  "orders/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/damanorganic/order_details/${id}`);
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error("Failed to fetch order details");
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to fetch order details"
      );
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  orders: [],
  loading: false,
  error: null,
  orderDetails: {},
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
    clearOrderDetails: (state) => {
      state.orderDetails = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch order by ID
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetails = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrderError, clearOrderDetails } =
  ordersSlice.actions;
export default ordersSlice.reducer;
