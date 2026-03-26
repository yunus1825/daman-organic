import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { message } from "antd";
import api from "../../utils/api";

// Fetch CustomerList
export const fetchCustomerList = createAsyncThunk(
  "CustomerList/fetchCustomerList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/damanorganic/userlist`);
      if (response.data.code === 200) {
        return response.data.data.results;
      } else {
        message.error("Failed to fetch CustomerList: Something went wrong");
        throw new Error("Failed to fetch CustomerList");
      }
    } catch (error) {
      message.error("Failed to fetch CustomerList: Something went wrong");
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  customerlist: [],
  loading: false,
  error: null,
};

const CustomerListSlice = createSlice({
  name: "CustomerList",
  initialState,
  
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerList.fulfilled, (state, action) => {
        state.loading = false;
        state.customerlist = action.payload;
      })
      .addCase(fetchCustomerList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
  },
});
export const { clearCustomerListDetails } = CustomerListSlice.actions;
export default CustomerListSlice.reducer;
