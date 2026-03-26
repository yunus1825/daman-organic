import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { message } from "antd";
import api from "../../utils/api";

// Fetch CartList
export const fetchCartList = createAsyncThunk(
  "CartList/fetchCartList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/damanorganic/users_cart_list`);
      if (response.data.code === 200) {
        return response.data.data.results;
      } else {
        message.error("Failed to fetch CartList: Something went wrong");
        throw new Error("Failed to fetch CartList");
      }
    } catch (error) {
      message.error("Failed to fetch CartList: Something went wrong");
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  cartlist: [],
  loading: false,
  error: null,
};

const CartListSlice = createSlice({
  name: "CartList",
  initialState,
  
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartList.fulfilled, (state, action) => {
        state.loading = false;
        state.cartlist = action.payload;
      })
      .addCase(fetchCartList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
  },
});
export const { clearCartListDetails } = CartListSlice.actions;
export default CartListSlice.reducer;
