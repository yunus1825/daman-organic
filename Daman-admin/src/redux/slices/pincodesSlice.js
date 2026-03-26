import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { uploadImage } from "../Utils";
import { message } from "antd";
import api from "../../utils/api";

// Fetch Pincodes
export const fetchPincodes = createAsyncThunk(
  "Pincodes/fetchPincodes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/damanorganic/pincode_list`);
      if (response.data.code === 200) {
        return response.data.data.results;
      } else {
        message.error("Failed to fetch Pincodes: Something went wrong");
        throw new Error("Failed to fetch Pincodes");
      }
    } catch (error) {
      message.error("Failed to fetch Pincodes: Something went wrong");
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Add a Pincode
export const addPincodes = createAsyncThunk(
  "Pincodes/addPincodes",
  async ({ navigate, setLoading, PincodeData }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/damanorganic/pincode_add`, {
        city: PincodeData.city,
        area: PincodeData.area,
        pincode: PincodeData.pincode,
      });
      if (response.data.code === 200) {
        navigate("/pincodesList");
        setLoading(false);
        return response.data.data.results;
      } else {
        message.error("Failed to add Pincode: Something went wrong");
        throw new Error("Failed to add Pincode");
      }
    } catch (error) {
      setLoading(false);
      message.error("Failed to add Pincode: Something went wrong");
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update a Pincode
export const updatePincodes = createAsyncThunk(
  "Pincodes/updatePincodes",
  async ({ id, navigate, updatedData }, { rejectWithValue }) => {
    try {
      let imageUrl;
      if (updatedData?.file) {
        imageUrl = await uploadImage(updatedData?.file);
      }
      const response = await api.put(`/api/damanorganic/pincode_upd/${id}`, {
        city: updatedData.city,
        area: updatedData.area,
        pincode: updatedData.pincode,
      });
      if (response.data.code === 200) {
        navigate("/pincodesList");
        return;
      } else {
        message.error("Failed to update Pincode: Something went wrong");
        throw new Error("Failed to update Pincode");
      }
    } catch (error) {
      message.error("Failed to update Pincode: Something went wrong");
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const fetchPincodeById = createAsyncThunk(
  "Pincodes/fetchPincodeById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/damanorganic/pincodes/${id}`);
      if (response.data.code === 200) {
        return response.data.data.results;
      } else {
        message.error(`Failed to fetch Pincode details: Something went wrong`);
        throw new Error("Failed to fetch Pincode");
      }
    } catch (error) {
      message.error(`Failed to fetch Pincode details : Something went wrong`);
      return rejectWithValue(error.response.data);
    }
  }
);
// Delete a Pincode
export const deletePincode = createAsyncThunk(
  "Pincodes/deletePincode",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/damanorganic/pincodes_del/${id}`);
      if (response.data.code === 200) {
        message.success("Deleted Pincode successfully");
        return id;
      } else {
        message.error("Failed to delete Pincode: Something went wrong");
      }
    } catch (error) {
      message.error("Failed to delete Pincode");
    }
  }
);

const initialState = {
  pincodes: [],
  loading: false,
  PincodeDetails: null,
  error: null,
};

const PincodesSlice = createSlice({
  name: "Pincodes",
  initialState,
  reducers: {
    clearPincodeDetails: (state) => {
      state.PincodeDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPincodes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPincodes.fulfilled, (state, action) => {
        state.loading = false;
        state.pincodes = action.payload;
      })
      .addCase(fetchPincodes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addPincodes.pending, (state) => {
        state.loading = true;
      })
      .addCase(addPincodes.fulfilled, (state, action) => {
        state.loading = false;
        state.pincodes.push(action.payload);
      })
      .addCase(addPincodes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPincodeById.pending, (state) => {
        state.loading = true;
        state.PincodeDetails = null;
      })
      .addCase(fetchPincodeById.fulfilled, (state, action) => {
        state.loading = false;
        state.PincodeDetails = action.payload;
      })
      .addCase(fetchPincodeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatePincodes.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePincodes.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.pincodes.findIndex(
          (Pincode) => Pincode._id === action.payload._id
        );
        if (index !== -1) {
          state.pincodes[index] = {
            ...state.pincodes[index],
            ...action.payload.updatedData,
          };
        }
      })
      .addCase(updatePincodes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deletePincode.fulfilled, (state, action) => {
        state.Pincodes = state.pincodes.filter(
          (Pincode) => Pincode._id !== action.payload
        );
      })
      .addCase(deletePincode.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});
export const { clearPincodeDetails } = PincodesSlice.actions;
export default PincodesSlice.reducer;
