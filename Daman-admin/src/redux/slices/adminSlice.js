// src/features/admin/adminSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { message } from "antd";

export const fetchAdmins = createAsyncThunk(
  "admins/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/damanorganic/adminuser");
      if (response.data.code === 200) {
        return response.data.data.results;
      } else {
        throw new Error("failed to fetch admins");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "failed to fetch admins");
    }
  }
);

export const addAdmin = createAsyncThunk(
  "admins/add",
  async ({ navigate, setLoading, adminData }, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/damanorganic/adminuser", adminData);
      if (response.data.code === 200) {
        navigate("/admins");
        setLoading(false);
        return response.data.data.results;
      } else {
        message.error("Failed to add admin");
        throw new Error("Failed to add admin");
      }
    } catch (error) {
      setLoading(false);
      message.error(error.response?.data.message || "Failed to add admin");
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateAdmin = createAsyncThunk(
  "admins/update",
  async ({ id, updatedData, navigate }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/api/damanorganic/adminuser/${id}`,
        updatedData
      );
      if (response.data.code === 200) {
        navigate("/admins");
        message.success("Successfully updated admin");
        return response.data.data.results;
      } else {
        throw new Error("failed to update admin");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "failed to update admin");
    }
  }
);

export const fetchAdminById = createAsyncThunk(
  "admins/fetchAdminById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/damanorganic/adminuser/${id}`);
      if (response.data.code === 200) {
        return response.data.data.results;
      } else {
        message.error(`Failed to fetch admin details`);
        throw new Error("Failed to fetch admin");
      }
    } catch (error) {
      message.error(
        error.response.data.message || `Failed to fetch admin details`
      );
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteAdmin = createAsyncThunk(
  "admins/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/damanorganic/adminuser/${id}`);
      if (response.data.code === 200) {
        message.success("Succesfully deleted admin user");
        return id;
      } else {
        throw new Error("Failed to delete admin user");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to delete admin user");
    }
  }
);

const initialState = {
  admins: [],
  loading: false,
  error: null,
  adminDetails: {},
};

const adminSlice = createSlice({
  name: "admins",
  initialState,
  reducers: {
    // Clear error state if needed
    clearError: (state) => {
      state.error = null;
    },
    clearAdminDetails: (state) => {
      state.adminDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchAdmins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdmins.fulfilled, (state, action) => {
        state.loading = false;
        state.admins = action.payload;
      })
      .addCase(fetchAdmins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADD
      .addCase(addAdmin.pending, (state) => {
        state.error = null;
      })
      .addCase(addAdmin.fulfilled, (state, action) => {
        state.admins.push(action.payload);
      })
      .addCase(addAdmin.rejected, (state, action) => {
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateAdmin.pending, (state) => {
        state.error = null;
      })
      .addCase(updateAdmin.fulfilled, (state, action) => {
        const index = state.admins.findIndex(
          (admin) => admin._id === action.payload._id
        );
        if (index !== -1) state.admins[index] = action.payload;
      })
      .addCase(updateAdmin.rejected, (state, action) => {
        state.error = action.payload;
      })
      // fetch by id
      .addCase(fetchAdminById.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(fetchAdminById.fulfilled, (state, action) => {
        state.adminDetails = action.payload;
        state.loading = false;
      })
      .addCase(fetchAdminById.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // DELETE
      .addCase(deleteAdmin.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteAdmin.fulfilled, (state, action) => {
        state.admins = state.admins.filter(
          (admin) => admin._id !== action.payload
        );
      })
      .addCase(deleteAdmin.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError, clearAdminDetails } = adminSlice.actions;
export default adminSlice.reducer;
