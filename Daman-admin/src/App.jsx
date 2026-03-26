import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import { AuthProvider } from "./context/authContext.jsx";
import EditCategory from "./pages/categories/EditCategory.jsx";
import EditAdmin from "./pages/Admins/EditAdmin.jsx";
import Loader from "./components/Loader.jsx";
import EditProduct from "./pages/Product/EditProduct.jsx";
import HomeSectionsList from "./pages/HomeSections/HomeSectionsList.jsx";
import AddSection from "./pages/HomeSections/AddSection.jsx";
import EditSection from "./pages/HomeSections/EditSection.jsx";
import CartDetails from "./pages/CartList/CartDetails.jsx";
import DeliveryChargesList from "./pages/DeliveryCharges/DeliveryChargesList.jsx";
import AddDeliveryCharge from "./pages/DeliveryCharges/AddDeliveryCharge.jsx";
import EditDeliveryCharge from "./pages/DeliveryCharges/EditDeliveryCharge.jsx";
import StoreList from "./pages/StoreManagement/StoreList.jsx";
import AddStore from "./pages/StoreManagement/AddStore.jsx";
import EditStore from "./pages/StoreManagement/EditStore.jsx";
import AllOrders from "./pages/AllOrders/AllOrders.jsx";
import OrderDetails from "./pages/AllOrders/OrderDetails.jsx";
import MarqueeManager from "./pages/Marquee/MarqueeManager.jsx";
import OrderDetailsShare from "./pages/AllOrders/OrderDetailsShare.jsx";

const Login = lazy(() => import("./pages/login/Login"));
const DashboardLayout = lazy(() =>
  import("./pages/globalComponents/DashboardLayout")
);
const DashBoard = lazy(() => import("./pages/Dashboard/DashBoard.jsx"));
const SlidersList = lazy(() => import("./pages/sliders/SlidersList.jsx"));
const AddSlider = lazy(() => import("./pages/sliders/AddSlider.jsx"));
const EditSlider = lazy(() => import("./pages/sliders/EditSlider.jsx"));
const PageNotFound = lazy(() => import("./components/PageNotFound.jsx"));
const AddCategory = lazy(() => import("./pages/categories/AddCategory.jsx"));
const CategoryList = lazy(() => import("./pages/categories/CategoryList.jsx"));
const ProductsByCategory = lazy(() =>
  import("./pages/categories/ProductsByCategory.jsx")
);
const AdminList = lazy(() => import("./pages/Admins/AdminList.jsx"));
const AddAdmin = lazy(() => import("./pages/Admins/AddAdmin.jsx"));

// products
const ProductsList = lazy(() => import("./pages/Product/ProductsList.jsx"));
const AddProduct = lazy(() => import("./pages/Product/AddProduct.jsx"));

const PincodesList = lazy(() => import("./pages/Pincodes/PincodesList.jsx"));
const AddPincode = lazy(() => import("./pages/Pincodes/AddPincodes.jsx"));
const EditPincode = lazy(() => import("./pages/Pincodes/EditPincodes.jsx"));

const CartList = lazy(() => import("./pages/CartList/CartList.jsx"));
const CustomerList = lazy(() => import("./pages/Customer/CustomerList.jsx"));

const AdminRoute = (Component) => (
  <ProtectedRoute allowedRoles={["Admin"]}>
    <DashboardLayout>{Component}</DashboardLayout>
  </ProtectedRoute>
);

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<Loader></Loader>}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/marquee" element={AdminRoute(<MarqueeManager />)} />
            <Route path="/dashboard" element={AdminRoute(<DashBoard />)} />
            <Route path="/SlidersList" element={AdminRoute(<SlidersList />)} />
            <Route path="/AddSlider" element={AdminRoute(<AddSlider />)} />
            <Route
              path="/EditSlider/:id"
              element={AdminRoute(<EditSlider />)}
            />
            <Route path="/categories" element={AdminRoute(<CategoryList />)} />
            <Route path="/addCategory" element={AdminRoute(<AddCategory />)} />
            <Route
              path="/editCategory/:id"
              element={AdminRoute(<EditCategory />)}
            />
            <Route
              path="/categoryProducts/:id"
              element={AdminRoute(<ProductsByCategory />)}
            />
            {/* Home section  */}
            <Route
              path="/homeSectionList"
              element={AdminRoute(<HomeSectionsList />)}
            />
            <Route path="/AddSection" element={AdminRoute(<AddSection />)} />
            <Route
              path="/EditSection/:id"
              element={AdminRoute(<EditSection />)}
            />

            <Route path="/admins" element={AdminRoute(<AdminList />)} />
            <Route path="/addAdmin" element={AdminRoute(<AddAdmin />)} />
            <Route path="/editAdmin/:id" element={AdminRoute(<EditAdmin />)} />

            {/* products  */}
            <Route path="/products" element={AdminRoute(<ProductsList />)} />
            <Route path="/addProduct" element={AdminRoute(<AddProduct />)} />
            <Route
              path="/editProduct/:productId"
              element={AdminRoute(<EditProduct />)}
            />
            {/* Pincodes */}
            <Route
              path="/pincodesList"
              element={AdminRoute(<PincodesList />)}
            />
            <Route path="/AddPincode" element={AdminRoute(<AddPincode />)} />
            <Route
              path="/EditPincode/:id"
              element={AdminRoute(<EditPincode />)}
            />
            {/* Cart List */}
            <Route path="/cartlist" element={AdminRoute(<CartList />)} />
            <Route
              path="/cart-details/:id"
              element={AdminRoute(<CartDetails />)}
            />
            {/* Customer List */}
            <Route path="/customers" element={AdminRoute(<CustomerList />)} />

            {/* delivery charges  */}
            <Route
              path="/delivery-charges"
              element={AdminRoute(<DeliveryChargesList />)}
            />
            <Route
              path="/AddDeliveryCharge"
              element={AdminRoute(<AddDeliveryCharge />)}
            />
            <Route
              path="/EditDeliveryCharge/:id"
              element={AdminRoute(<EditDeliveryCharge />)}
            />

            {/* store management  */}
            <Route path="/store-list" element={AdminRoute(<StoreList />)} />
            <Route path="/AddStore" element={AdminRoute(<AddStore />)} />
            <Route
              path="/EditStore/:storeId"
              element={AdminRoute(<EditStore />)}
            />

            {/* All orders  */}
            <Route path="/AllOrders" element={AdminRoute(<AllOrders />)} />
            <Route
              path="/order-details/:orderId"
              element={AdminRoute(<OrderDetails />)}
            />
            <Route
              path="/order-details-share/:orderId"
              element={<OrderDetailsShare></OrderDetailsShare>}
            />

            <Route
              path="*"
              element={
                <DashboardLayout>
                  <PageNotFound />
                </DashboardLayout>
              }
            />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
};

export default App;
