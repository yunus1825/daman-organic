import { configureStore } from "@reduxjs/toolkit";
import slidersReducer from "./slices/sliderSlice.js";
import categoryReducer from "./slices/categorySlice.js";
import adminReducer from "./slices/adminSlice.js";
import productsReducer from "./slices/productSlice.js";
import pincodeReducer from "./slices/pincodesSlice.js";
import cartlistReducer from "./slices/cartlistSlice.js";
import customerReducer from "./slices/customerSlice.js";
import homeSectionsReducer from "./slices/homeSectionSlice.js";
import cartDetailsReducer from "./slices/cartDetails.js";
import deliveryChargesReducer from "./slices/deliveryChargesSlice.js";
import storeManagementReducer from "./slices/storeManagementSlice.js";
import orderReducer from "./slices/ordersSlice.js";
import orderNotificationReducer from "./slices/orderNotification.js";
import productByCategoryReducer from "./slices/productsByCategorySlice";
import marqueeReducer from "./slices/marqueeSlice.js";

const store = configureStore({
  reducer: {
    sliders: slidersReducer,
    category: categoryReducer,
    marquee: marqueeReducer,
    admins: adminReducer,
    products: productsReducer,
    pincodes: pincodeReducer,
    cartlist: cartlistReducer,
    customerlist: customerReducer,
    homeSections: homeSectionsReducer,
    cartDetails: cartDetailsReducer,
    deliveryCharges: deliveryChargesReducer,
    stores: storeManagementReducer,
    orders: orderReducer,
    orderNotification: orderNotificationReducer,
    productsByCategory: productByCategoryReducer,
  },
});

export default store;
