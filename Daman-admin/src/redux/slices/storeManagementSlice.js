// src/features/storeManagement/storeManagementSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { message } from "antd";

// Fetch all stores
export const fetchStores = createAsyncThunk(
  "stores/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/damanorganic/store_list");
      if (response.data.code === 200) {
        return response.data.data.results;
      } else {
        throw new Error("Failed to fetch stores");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to fetch stores");
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Add a new store
export const addStore = createAsyncThunk(
  "stores/add",
  async ({ navigate, setLoading, storeData }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/api/damanorganic/store_add",
        storeData
      );
      if (response.data.code === 200) {
        navigate("/store-list");
        setLoading(false);
        message.success("Store added successfully");
        return response.data.data.results;
      } else {
        throw new Error("Failed to add store");
      }
    } catch (error) {
      setLoading(false);
      message.error(error.response?.data?.message || "Failed to add store");
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update an existing store
export const updateStore = createAsyncThunk(
  "stores/update",
  async ({ id, updatedData, navigate }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/api/damanorganic/store_upd/${id}`,
        updatedData
      );
      if (response.data.code === 200) {
        navigate("/store-list");
        message.success("Store updated successfully");
        return response.data.data.results;
      } else {
        throw new Error("Failed to update store");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to update store");
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Fetch a store by ID
export const fetchStoreById = createAsyncThunk(
  "stores/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/damanorganic/store_details/${id}`);
      if (response.data.code === 200) {
        return response.data.data.results;
      } else {
        throw new Error("Failed to fetch store details");
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to fetch store details"
      );
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Delete a store
export const deleteStore = createAsyncThunk(
  "stores/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/damanorganic/store_del/${id}`);
      if (response.data.code === 200) {
        message.success("Store deleted successfully");
        return id;
      } else {
        throw new Error("Failed to delete store");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to delete store");
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  stores: [],
  loading: false,
  error: null,
  storeDetails: {},
};

const storeManagementSlice = createSlice({
  name: "stores",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearStoreDetails: (state) => {
      state.storeDetails = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all stores
      .addCase(fetchStores.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStores.fulfilled, (state, action) => {
        state.loading = false;
        state.stores = action.payload;
      })
      .addCase(fetchStores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add a new store
      .addCase(addStore.pending, (state) => {
        state.error = null;
      })
      .addCase(addStore.fulfilled, (state, action) => {
        state.stores.push(action.payload);
      })
      .addCase(addStore.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Update an existing store
      .addCase(updateStore.pending, (state) => {
        state.error = null;
      })
      .addCase(updateStore.fulfilled, (state, action) => {
        const index = state.stores.findIndex(
          (store) => store._id === action.payload._id
        );
        if (index !== -1) {
          state.stores[index] = action.payload;
        }
      })
      .addCase(updateStore.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Fetch a store by ID
      .addCase(fetchStoreById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStoreById.fulfilled, (state, action) => {
        state.loading = false;
        state.storeDetails = action.payload;
      })
      .addCase(fetchStoreById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete a store
      .addCase(deleteStore.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteStore.fulfilled, (state, action) => {
        state.stores = state.stores.filter(
          (store) => store._id !== action.payload
        );
      })
      .addCase(deleteStore.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError, clearStoreDetails } = storeManagementSlice.actions;
export default storeManagementSlice.reducer;
