// src/features/homeSection/homeSectionSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { message } from "antd";

export const fetchHomeSections = createAsyncThunk(
  "homeSections/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/damanorganic/home_section_list");
      if (response.data.code === 200) {
        return response.data.data.results;
      } else {
        throw new Error("Failed to fetch home sections");
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to fetch home sections"
      );
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addHomeSection = createAsyncThunk(
  "homeSections/add",
  async ({ navigate, setLoading, sectionData }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/api/damanorganic/home_section_add",
        sectionData
      );
      if (response.data.code === 200) {
        navigate("/homeSectionList");
        setLoading(false);
        message.success("Home section added successfully");
        return response.data.data.results;
      } else {
        message.error("Failed to add home section");
        throw new Error("Failed to add home section");
      }
    } catch (error) {
      setLoading(false);
      message.error(
        error.response?.data.message || "Failed to add home section"
      );
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateHomeSection = createAsyncThunk(
  "homeSections/update",
  async ({ id, updatedData, navigate, setLoading }, { rejectWithValue }) => {
    try {
      setLoading(true)
      const response = await api.put(
        `/api/damanorganic/home_section_upd/${id}`,
        updatedData
      );
      if (response.data.code === 200) {
        navigate("/homeSectionList");

        message.success("Home section updated successfully");
        return response.data.data.results;
      } else {
        throw new Error("Failed to update home section");
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to update home section"
      );
      return rejectWithValue(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  }
);

export const fetchHomeSectionById = createAsyncThunk(
  "homeSections/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/api/damanorganic/home_section_detail/${id}`
      );
      if (response.data.code === 200) {
        return response.data.data.results;
      } else {
        message.error("Failed to fetch home section details");
        throw new Error("Failed to fetch home section");
      }
    } catch (error) {
      message.error(
        error.response.data.message || "Failed to fetch home section details"
      );
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteHomeSection = createAsyncThunk(
  "homeSections/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(
        `/api/damanorganic/home_section_del/${id}`
      );
      if (response.data.code === 200) {
        message.success("Home section deleted successfully");
        return id;
      } else {
        throw new Error("Failed to delete home section");
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to delete home section"
      );
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  homeSections: [],
  loading: false,
  error: null,
  sectionDetails: {},
};

const homeSectionSlice = createSlice({
  name: "homeSections",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSectionDetails: (state) => {
      state.sectionDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH ALL
      .addCase(fetchHomeSections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomeSections.fulfilled, (state, action) => {
        state.loading = false;
        state.homeSections = action.payload;
      })
      .addCase(fetchHomeSections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADD
      .addCase(addHomeSection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addHomeSection.fulfilled, (state, action) => {
        state.loading = false;
        state.homeSections.push(action.payload);
      })
      .addCase(addHomeSection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateHomeSection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateHomeSection.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.homeSections.findIndex(
          (section) => section._id === action.payload._id
        );
        if (index !== -1) state.homeSections[index] = action.payload;
      })
      .addCase(updateHomeSection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH BY ID
      .addCase(fetchHomeSectionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomeSectionById.fulfilled, (state, action) => {
        state.loading = false;
        state.sectionDetails = action.payload;
      })
      .addCase(fetchHomeSectionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteHomeSection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteHomeSection.fulfilled, (state, action) => {
        state.loading = false;
        state.homeSections = state.homeSections.filter(
          (section) => section._id !== action.payload
        );
      })
      .addCase(deleteHomeSection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSectionDetails } = homeSectionSlice.actions;
export default homeSectionSlice.reducer;
