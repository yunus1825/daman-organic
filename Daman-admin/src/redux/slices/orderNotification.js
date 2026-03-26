import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { message } from "antd";

// Fetch all orders
export const fetchOrderNotifications = createAsyncThunk(
  "orderNotification/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/damanorganic/order_notification");
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

// Accept Order
export const acceptOrder = createAsyncThunk(
  "orderNotification/acceptOrder",
  async ({ id, body }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/api/damanorganic/acceptorder/${id}`,
        body
      );
      if (response.data.code === 200) {
        message.success("Order accepted successfully");
        return { id, updatedData: response.data.data };
      } else {
        throw new Error("Failed to accept order");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to accept order");
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Assign Order
export const assignOrder = createAsyncThunk(
  "orderNotification/assignOrder",
  async ({ id, body }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/api/damanorganic/assign_order/${id}`,
        body
      );
      if (response.data.code === 200) {
        message.success("Order assigned successfully");
        return { id, updatedData: response.data.data };
      } else {
        throw new Error("Failed to assign order");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to assign order");
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Deliver Order
export const deliverOrder = createAsyncThunk(
  "orderNotification/deliverOrder",
  async ({ id, body }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/api/damanorganic/deliver_order/${id}`,
        body
      );
      if (response.data.code === 200) {
        message.success("Order delivered successfully");
        return { id, updatedData: response.data.data };
      } else {
        throw new Error("Failed to deliver order");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to deliver order");
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
// Deliver Order
export const cancelOrder = createAsyncThunk(
  "orderNotification/cancelOrder",
  async ({ id, body }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/api/damanorganic/cancel_order/${id}`,
        body
      );
      if (response.data.code === 200) {
        message.success("Order cancelled successfully");
        return { id, updatedData: response.data.data };
      } else {
        throw new Error("Failed to cancel order");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to cancel order");
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  orders: [],
  loading: false,
  error: null,
};

const orderNotificationSlice = createSlice({
  name: "orderNotification",
  initialState,
  reducers: {
    clearOrderNotificationError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all orders
      .addCase(fetchOrderNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrderNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Accept Order
      .addCase(acceptOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acceptOrder.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.orders.findIndex(
          (order) => order._id === action.payload.id
        );
        if (index !== -1) {
          state.orders[index] = {
            ...state.orders[index],
            ...action.payload.updatedData,
          };
        }
      })
      .addCase(acceptOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Assign Order
      .addCase(assignOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignOrder.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.orders.findIndex(
          (order) => order._id === action.payload.id
        );
        if (index !== -1) {
          state.orders[index] = {
            ...state.orders[index],
            ...action.payload.updatedData,
          };
        }
      })
      .addCase(assignOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Deliver Order
      .addCase(deliverOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deliverOrder.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.orders.findIndex(
          (order) => order._id === action.payload.id
        );
        if (index !== -1) {
          state.orders[index] = {
            ...state.orders[index],
            ...action.payload.updatedData,
          };
        }
      })
      .addCase(deliverOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Cancel Order
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.orders.findIndex(
          (order) => order._id === action.payload.id
        );
        if (index !== -1) {
          state.orders[index] = {
            ...state.orders[index],
            ...action.payload.updatedData,
          };
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrderNotificationError } = orderNotificationSlice.actions;
export default orderNotificationSlice.reducer;
