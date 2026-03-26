import React, { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Spin } from "antd"; // or your preferred loading component

// Import your components
const Home = lazy(() => import("./pages/Home/HomePage.jsx"));
const CategoryPage = lazy(() => import("./pages/Category/CategoryPage"));
const ProductDetailsPage = lazy(() =>
  import("./pages/ProductDetails/ProductDetailsPage")
);
const PageNotFound = lazy(() => import("./components/PageNotFound"));
const CartPage = lazy(() => import("./pages/Cart/CartPage"));
const LoginPage = lazy(() => import("./pages/auth/LoginPage.jsx"));
const WhishlistPage = lazy(() => import("./pages/Whishlist/WhishlistPage"));
const ProfilePage = lazy(() => import("./pages/Profile/ProfilePage"));
const OrderDetailsPage = lazy(() =>
  import("./pages/OrderDetails/OrderDetailsPage")
);
const CheckOutPage = lazy(() => import("./pages/Checkout/CheckOutPage.jsx"));
const PaymentStatus = lazy(() =>
  import("./pages/PaymentStatus/PaymentStatus.jsx")
);

const PolicyPage = lazy(() => import("./pages/Policy/PolicyPage.jsx"));
const AboutUs = lazy(() => import("./pages/Policy/AboutPage.jsx"));
const CertificatesAndStores = lazy(() =>
  import("./pages/Policy/CertificatePage.jsx")
);
const StoreLocationsPage = lazy(() =>
  import("./pages/Policy/StoreLocationsPage.jsx")
);
const InstallPWA = lazy(() => import("./pages/Policy/InstallPWA.jsx"));

import { fetchCategories } from "./redux/slices/categoriesSlice.js";
import { fetchHomeSections } from "./redux/slices/homeSectionSlice.js";
import { fetchSliders } from "./redux/slices/sliderSlice.js";
import { fetchUser } from "./redux/slices/userSlice";
import api from "./utils/api.js";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
} from "./redux/slices/authSlice.js";
import ProtectedRoute from "./components/global/ProtectedRoute.jsx";
import { fetchWishlist } from "./redux/slices/wishlistSlice.js";
import { fetchAddresses } from "./redux/slices/addressSlice.js";
import { fetchCart } from "./redux/slices/cartSlice.js";
import { fetchOrders } from "./redux/slices/ordersSlice.js";
import NoInternetScreen from "./components/global/NoInternetScreen .jsx";
import { useOnlineStatus } from "./hooks/useOnlineStatus.jsx";
import { fetchMarquees } from "./redux/slices/marqueeSlice.js";
import AdminRedirect from "./components/global/AdminRedirect.jsx";

const App = () => {
  const dispatch = useDispatch();
  const isOnline = useOnlineStatus();

  const { loading: authLoading } = useSelector((state) => state.auth);
  const [appInitialized, setAppInitialized] = useState(false);
  const userId = useSelector((state) => state.auth?.user?._id); // Assuming you have auth state

  useEffect(() => {
    const initializeAuth = async () => {
      const userId = localStorage.getItem("userId");

      if (userId) {
        try {
          dispatch(loginStart());
          // Set the auth token for the request

          // Fetch user details
          const response = await api.get(
            `/api/damanorganic/user_details/${userId}`
          );

          // Update Redux state
          dispatch(loginSuccess(response.data.data.results));
        } catch (error) {
          console.error("Failed to fetch user details", error);
          // Clear invalid credentials
          // dispatch(loginFailure(error.message));
          // dispatch(logout());

          // Only logout if it's not a network error
          if (
            !error.message.includes("Network Error") &&
            !error.message.includes("timeout")
          ) {
            dispatch(loginFailure(error.message));
            dispatch(logout());
          } else {
            // Handle network error differently (maybe show a message)
            dispatch(loginFailure("Network error - using cached credentials"));
          }
        }
      } else {
        dispatch(logout()); // Ensure clean state if no credentials
      }

      setAppInitialized(true);
    };

    initializeAuth();
  }, [dispatch]);

  useEffect(() => {
    if (appInitialized) {
      Promise.all([
        dispatch(fetchCategories()),
        dispatch(fetchHomeSections()),
        dispatch(fetchSliders()),
        dispatch(fetchMarquees()),
      ]);
    }
  }, [appInitialized, dispatch]);

  useEffect(() => {
    if (userId) {
      Promise.all([
        dispatch(fetchWishlist(userId)),
        dispatch(fetchAddresses(userId)),
        dispatch(fetchCart(userId)),
        dispatch(fetchOrders(userId)),
      ]);
    }
  }, [userId, dispatch]);

  // Show loading spinner while auth is initializing
  if (authLoading || !appInitialized) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" /> {/* Or your custom loading component */}
      </div>
    );
  }
  if (!isOnline) {
    return <NoInternetScreen />;
  }

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <Spin size="large" />
        </div>
      }
    >
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminRedirect />} />
          <Route path="/category" element={<CategoryPage />} />
          <Route path="/installpwa" element={<InstallPWA />} />
          <Route
            path="/product/:productName/:productId"
            element={<ProductDetailsPage />}
          />
          <Route path="/auth" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WhishlistPage />} />
            <Route path="/profile/:tab" element={<ProfilePage />} />
            <Route path="/checkout" element={<CheckOutPage />} />
            <Route
              path="/orderdetails/:orderId"
              element={<OrderDetailsPage />}
            />
            <Route
              path="/payment-status/:status/:orderId"
              element={<PaymentStatus />}
            />
          </Route>

          <Route path="/policy/:tab" element={<PolicyPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/certificates" element={<CertificatesAndStores />} />
          <Route path="/stores" element={<StoreLocationsPage />} />

          {/* Catch-all */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </Suspense>
  );
};

export default App;
