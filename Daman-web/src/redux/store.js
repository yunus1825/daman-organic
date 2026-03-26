import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import categoriesReducer from "./slices/categoriesSlice";
import homeSectionsReducer from "./slices/homeSectionSlice";
import slidersReducer from "./slices/sliderSlice";
import productByCategoryReducer from "./slices/productsByCategorySlice";
import productDetailsReducer from "./slices/productDetailsSlice";
import authReducer from "./slices/authSlice";
import wishlistReducer from "./slices/wishlistSlice";
import addressReducer from "./slices/addressSlice";
import cartReducer from "./slices/cartSlice";
import orderReducer from "./slices/ordersSlice.js";
import marqueeReducer from "./slices/marqueeSlice.js";

export const store = configureStore({
  reducer: {
    user: userReducer,
    categories: categoriesReducer,
    marquee: marqueeReducer,
    homeSections: homeSectionsReducer,
    sliders: slidersReducer,
    productsByCategory: productByCategoryReducer,
    productDetails: productDetailsReducer,
    auth: authReducer,
    wishlist: wishlistReducer,
    address: addressReducer,
    cart: cartReducer,
    orders: orderReducer,
  },
});
