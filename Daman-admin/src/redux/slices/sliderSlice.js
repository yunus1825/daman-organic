import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { uploadImage } from "../Utils";
import { message } from "antd";
import api from "../../utils/api";

// Fetch sliders
export const fetchSliders = createAsyncThunk(
  "sliders/fetchSliders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/damanorganic/slider_list`);
      if (response.data.code === 200) {
        return response.data.data.results;
      } else {
        message.error("Failed to fetch sliders: Something went wrong");
        throw new Error("Failed to fetch sliders");
      }
    } catch (error) {
      message.error("Failed to fetch sliders: Something went wrong");
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// Add a slider
export const addSlider = createAsyncThunk(
  "sliders/addSlider",
  async ({ navigate, setLoading, sliderData }, { rejectWithValue }) => {
    try {
      const imageUrl = await uploadImage(sliderData.file);
      const response = await api.post(`/api/damanorganic/slider_add`, {
        Tittle: sliderData.Tittle,
        Image: imageUrl,
        Description: sliderData.Description,
      });
      if (response.data.code === 200) {
        navigate("/SlidersList");
        setLoading(false);
        return response.data.data.results;
      } else {
        message.error("Failed to add slider: Something went wrong");
        throw new Error("Failed to add slider");
      }
    } catch (error) {
      setLoading(false);
      message.error("Failed to add slider: Something went wrong");
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// update slider order
export const updateSliderOrder = createAsyncThunk(
  "sliders/updateOrder",
  async (reorderedSliders) => {
    const orderedIds = {
      order_json: reorderedSliders.map((s, i) => ({
        SliderId: s._id,
        order: i,
      })),
    };

    const response = await api.put(
      "/api/damanorganic/sliders_updateorder",
      orderedIds,
    );

    if (response.data.code === 200) {
      return response.data.data.results;
    } else {
      throw new Error("Failed to update slider order");
    }
  },
);

// Update a slider
export const updateSlider = createAsyncThunk(
  "sliders/updateSlider",
  async ({ id, navigate, updatedData }, { rejectWithValue }) => {
    try {
      let imageUrl;
      if (updatedData?.file) {
        imageUrl = await uploadImage(updatedData?.file);
      }
      const response = await api.put(`/api/damanorganic/slider_update/${id}`, {
        Tittle: updatedData.Tittle,
        Description: updatedData.Description,
        Image: updatedData.file ? imageUrl : updatedData?.image,
      });
      if (response.data.code === 200) {
        navigate("/SlidersList");
        return;
      } else {
        message.error("Failed to update slider: Something went wrong");
        throw new Error("Failed to update slider");
      }
    } catch (error) {
      message.error("Failed to update slider: Something went wrong");
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);
export const fetchSliderById = createAsyncThunk(
  "sliders/fetchSliderById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/damanorganic/slider/${id}`);
      if (response.data.code === 200) {
        return response.data.data.results;
      } else {
        message.error(`Failed to fetch slider details: Something went wrong`);
        throw new Error("Failed to fetch slider");
      }
    } catch (error) {
      message.error(`Failed to fetch slider details : Something went wrong`);
      return rejectWithValue(error.response.data);
    }
  },
);
// Delete a slider
export const deleteSlider = createAsyncThunk(
  "sliders/deleteSlider",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/damanorganic/slider_del/${id}`);
      if (response.data.code === 200) {
        message.success("Deleted slider successfully");
        return id;
      } else {
        message.error("Failed to delete slider: Something went wrong");
      }
    } catch (error) {
      message.error("Failed to delete slider");
    }
  },
);

const initialState = {
  sliders: [],
  loading: false,
  sliderDetails: null,
  error: null,
};

const slidersSlice = createSlice({
  name: "sliders",
  initialState,
  reducers: {
    clearSliderDetails: (state) => {
      state.sliderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSliders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSliders.fulfilled, (state, action) => {
        state.loading = false;
        state.sliders = action.payload;
      })
      .addCase(fetchSliders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addSlider.pending, (state) => {
        state.loading = true;
      })
      .addCase(addSlider.fulfilled, (state, action) => {
        state.loading = false;
        state.sliders.push(action.payload);
      })
      .addCase(addSlider.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSliderById.pending, (state) => {
        state.loading = true;
        state.sliderDetails = null;
      })
      .addCase(fetchSliderById.fulfilled, (state, action) => {
        state.loading = false;
        state.sliderDetails = action.payload;
      })
      .addCase(fetchSliderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateSliderOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateSliderOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.sliders = action.payload;
      })

      .addCase(updateSliderOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateSlider.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSlider.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.sliders.findIndex(
          (slider) => slider._id === action.payload._id,
        );
        if (index !== -1) {
          state.sliders[index] = {
            ...state.sliders[index],
            ...action.payload.updatedData,
          };
        }
      })
      .addCase(updateSlider.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteSlider.fulfilled, (state, action) => {
        state.sliders = state.sliders.filter(
          (slider) => slider._id !== action.payload,
        );
      })
      .addCase(deleteSlider.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});
export const { clearSliderDetails } = slidersSlice.actions;
export default slidersSlice.reducer;
