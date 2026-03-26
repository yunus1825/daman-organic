// src/features/deliveryCharges/deliveryChargesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { message } from "antd";

export const fetchDeliveryCharges = createAsyncThunk(
  "deliveryCharges/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/damanorganic/charges_list");
      if (response.data.code === 200) {
        return response.data.data.results;
      } else {
        throw new Error("Failed to fetch delivery charges");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to fetch delivery charges");
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addDeliveryCharge = createAsyncThunk(
  "deliveryCharges/add",
  async ({ navigate, setLoading, chargeData }, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/damanorganic/charges_add", chargeData);
      if (response.data.code === 200) {
        navigate("/delivery-charges");
        setLoading(false);
        message.success("Delivery charge added successfully");
        return response.data.data.results;
      } else {
        message.error("Failed to add delivery charge");
        throw new Error("Failed to add delivery charge");
      }
    } catch (error) {
      setLoading(false);
      message.error(error.response?.data.message || "Failed to add delivery charge");
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateDeliveryCharge = createAsyncThunk(
  "deliveryCharges/update",
  async ({ id, updatedData, navigate }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/api/damanorganic/charges_upd/${id}`,
        updatedData
      );
      if (response.data.code === 200) {
        navigate("/delivery-charges");
        message.success("Successfully updated delivery charge");
        return response.data.data.results;
      } else {
        throw new Error("Failed to update delivery charge");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to update delivery charge");
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchDeliveryChargeById = createAsyncThunk(
  "deliveryCharges/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/damanorganic/charges/${id}`);
      if (response.data.code === 200) {
        return response.data.data.results;
      } else {
        message.error(`Failed to fetch delivery charge details`);
        throw new Error("Failed to fetch delivery charge");
      }
    } catch (error) {
      message.error(
        error.response.data.message || `Failed to fetch delivery charge details`
      );
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteDeliveryCharge = createAsyncThunk(
  "deliveryCharges/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/damanorganic/charges_del/${id}`);
      if (response.data.code === 200) {
        message.success("Successfully deleted delivery charge");
        return id;
      } else {
        throw new Error("Failed to delete delivery charge");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to delete delivery charge");
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  deliveryCharges: [],
  loading: false,
  error: null,
  chargeDetails: {},
};

const deliveryChargesSlice = createSlice({
  name: "deliveryCharges",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearChargeDetails: (state) => {
      state.chargeDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH ALL
      .addCase(fetchDeliveryCharges.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeliveryCharges.fulfilled, (state, action) => {
        state.loading = false;
        state.deliveryCharges = action.payload;
      })
      .addCase(fetchDeliveryCharges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADD
      .addCase(addDeliveryCharge.pending, (state) => {
        state.error = null;
      })
      .addCase(addDeliveryCharge.fulfilled, (state, action) => {
        state.deliveryCharges.push(action.payload);
      })
      .addCase(addDeliveryCharge.rejected, (state, action) => {
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateDeliveryCharge.pending, (state) => {
        state.error = null;
      })
      .addCase(updateDeliveryCharge.fulfilled, (state, action) => {
        const index = state.deliveryCharges.findIndex(
          (charge) => charge._id === action.payload._id
        );
        if (index !== -1) state.deliveryCharges[index] = action.payload;
      })
      .addCase(updateDeliveryCharge.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // FETCH BY ID
      .addCase(fetchDeliveryChargeById.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(fetchDeliveryChargeById.fulfilled, (state, action) => {
        state.chargeDetails = action.payload;
        state.loading = false;
      })
      .addCase(fetchDeliveryChargeById.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // DELETE
      .addCase(deleteDeliveryCharge.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteDeliveryCharge.fulfilled, (state, action) => {
        state.deliveryCharges = state.deliveryCharges.filter(
          (charge) => charge._id !== action.payload
        );
      })
      .addCase(deleteDeliveryCharge.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError, clearChargeDetails } = deliveryChargesSlice.actions;
export default deliveryChargesSlice.reducer;