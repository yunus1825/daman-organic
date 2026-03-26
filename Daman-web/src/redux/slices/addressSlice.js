// addressSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { message } from "antd";

// Async thunk to add address
export const addAddress = createAsyncThunk(
  "address/addAddress",
  async ({ userId, addressData }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/api/damanorganic/myaddress/${userId}`,
        addressData
      );
      if (response.data.code === 200) {
        message.success(response.data.message || "Address added successfully");
        return response.data?.data?.results;
      }
      throw new Error(response.data?.data?.message || "Failed to add address");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.data?.message || error.message
      );
    }
  }
);

// Async thunk to update address
export const updateAddress = createAsyncThunk(
  "address/updateAddress",
  async ({ userId, addressId, addressData }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/api/damanorganic/myaddress/${addressId}`,
        addressData
      );
      if (response.data.code === 200) {
        message.success(
          response.data.message || "Address updated successfully"
        );
        return response.data.data.results;
      }
      throw new Error(response.data.message || "Failed to update address");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk to delete address
export const deleteAddress = createAsyncThunk(
  "address/deleteAddress",
  async ({ userId, addressId }, { rejectWithValue }) => {
    try {
      const response = await api.delete(
        `/api/damanorganic/myaddress/${addressId}`
      );
      if (response.data.code === 200) {
        message.success(
          response.data.message || "Address deleted successfully"
        );
        return addressId;
      }
      throw new Error(response.data.message || "Failed to delete address");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk to fetch addresses
export const fetchAddresses = createAsyncThunk(
  "address/fetchAddresses",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/api/damanorganic/myaddresslist/${userId}`
      );
      if (response.data.code === 200) {
        return response.data.data.results;
      }
      throw new Error(response.data.message || "Failed to fetch addresses");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  addresses: [],
  loading: false,
  error: null,
  operationLoading: false,
  operationError: null,
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    clearAddresses: (state) => {
      state.addresses = [];
      state.error = null;
    },
    clearAddressError: (state) => {
      state.error = null;
      state.operationError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add address cases
      .addCase(addAddress.pending, (state) => {
        state.error = null;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.addresses.push(action.payload);
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.error = action.payload;
        message.error(action.payload);
      })

      // Update address cases
      .addCase(updateAddress.pending, (state) => {
        state.operationError = null;
        state.error = null;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.operationLoading = false;
        const updatedAddress = action.payload;
        state.addresses = state.addresses.map((address) =>
          address._id === updatedAddress._id ? updatedAddress : address
        );
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.operationLoading = false;
        state.error = action.payload;
        message.error(action.payload);
      })

      // Delete address cases
      .addCase(deleteAddress.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.operationLoading = false;
        const deletedAddressId = action.payload;
        state.addresses = state.addresses.filter(
          (address) => address._id !== deletedAddressId
        );
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.operationLoading = false;
        state.error = action.payload;
        message.error(action.payload);
      })

      // Fetch addresses cases
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        message.error(action.payload);
      });
  },
});

export const { clearAddresses, clearAddressError } = addressSlice.actions;

export default addressSlice.reducer;
