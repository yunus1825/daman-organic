import React, { useEffect, useState } from "react";
import CheckoutNav from "./components/CheckoutNav";
import CheckoutStepper from "./components/CheckoutStepper";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import withLayout from "../../components/withLayout";
import Breadcrumb from "../../components/BreadCrumb";
import ErrorMessage from "../../components/global/ErrorMessage";
import LoadingSpinner from "../../components/global/LoadingSpinner";
import EmptyCartMessage from "../../components/global/EmptyCartMessage";
import { removeCartItem } from "../../redux/slices/cartSlice";
import { message } from "antd";
import { FREE_SHIPPING_THRESHOLD } from "../../constants/constants";

const CheckOutPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const {
    items: cart = [],
    loading: cartLoading,
    error: cartError,
  } = useSelector((state) => state.cart);
  const userId = useSelector((state) => state.auth.user?._id);
  const dispatch = useDispatch();

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [distanceDetails, setDistanceDetails] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const nextStep = () => {
    // Check if any product in cart is out of stock
    // const outOfStockItem = cart.find((item) => item.product?.status === false);

    const outOfStockItem = cart.find((item) => {
      if (item.product.variantData) {
        // If the item has a variant, check variant stock/status
        return item.product.variantData.inStock === false;
      }
      // Otherwise, check product-level stock
      return item.product?.status === false;
    });

    if (outOfStockItem) {
      message.error(
        `${
          outOfStockItem.product?.prd_Name || "One of the products"
        } is out of stock. Please remove it to continue.`,
      );
      return; // prevent going to next step
    }

    setIsProcessing(true);
    // Simulate async operation (replace with your actual logic)
    setCurrentStep((prev) => {
      const newStep = Math.min(prev + 1, 3);
      scrollToTop();
      setIsProcessing(false);
      return newStep;
    });
  };

  const prevStep = () => {
    setCurrentStep((prev) => {
      const newStep = Math.max(prev - 1, 1);
      scrollToTop();
      return newStep;
    });
  };

  useEffect(() => {
    const shouldOpen =
      sessionStorage.getItem("shouldOpenAddressCart") === "true";
    if (shouldOpen) {
      setCurrentStep(2);
      sessionStorage.removeItem("shouldOpenAddressCart");
    }
    return () => {
      if (shouldOpen) {
        sessionStorage.removeItem("shouldOpenAddressCart");
      }
    };
  }, []);

  const getItemPrice = (item) => {
    return item.product?.variantData
      ? item.product.variantData.selling_Price
      : item.product?.selling_price;
  };
  const removeItemFromCart = async (id) => {
    try {
      await dispatch(removeCartItem(id)).unwrap();
    } catch (error) {
      message.error("Failed to remove item");
    } finally {
      setLoading(false);
    }
  };
  const subtotal = cart.reduce((sum, item) => {
    const price = getItemPrice(item);
    return sum + price * item.quantity;
  }, 0);

  if (cartLoading) {
    return (
      <div className="container mx-auto min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (cartError) {
    return (
      <div className="container mx-auto min-h-screen flex items-center justify-center">
        <ErrorMessage
          message={cartError}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto min-h-screen flex items-center justify-center">
        <EmptyCartMessage></EmptyCartMessage>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto">
        <Breadcrumb />
        <div className="min-h-screen py-8">
          <div className="mx-auto">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <CheckoutNav
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
              />

              <div className="p-6 md:p-8 lg:flex lg:gap-8">
                <div className="lg:w-2/3">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: currentStep === 1 ? -50 : 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: currentStep === 1 ? -50 : 50 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CheckoutStepper
                        currentStep={currentStep}
                        cart={cart}
                        cartLoading={isProcessing || cartLoading}
                        cartError={cartError}
                        selectedAddress={selectedAddress}
                        selectedPayment={selectedPayment}
                        setSelectedAddress={setSelectedAddress}
                        setSelectedPayment={setSelectedPayment}
                        nextStep={nextStep}
                        prevStep={prevStep}
                        removeItem={removeItemFromCart}
                        isProcessing={isProcessing}
                        distanceDetails={distanceDetails}
                        setDistanceDetails={setDistanceDetails}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Order Summary Sidebar */}
                <div className="hidden lg:block lg:w-1/3">
                  <div className="bg-gray-50 p-6 rounded-lg sticky top-8">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">
                      Order Summary
                    </h3>

                    {isProcessing ? (
                      <div className="flex justify-center py-4">
                        <LoadingSpinner size="small" />
                      </div>
                    ) : (
                      <>
                        <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                          {cart.map((item) => {
                            const price = getItemPrice(item);
                            const variant = item.product?.variantData;
                            const unit_value = variant
                              ? variant.quantity
                              : item?.product.quantity;
                            const unit_type = variant
                              ? variant.Type
                              : item?.product.Type;
                            return (
                              <div
                                key={item?._id}
                                className="flex items-center gap-4"
                              >
                                <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden">
                                  <img
                                    src={item?.product?.image}
                                    alt={item?.product?.prd_Name}
                                    loading="lazy"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium">
                                    {item?.product?.prd_Name}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    {`${unit_value} ${unit_type}`}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Qty: {item.quantity}
                                  </p>
                                </div>
                                <div className="font-medium">
                                  Rs {(price * item.quantity).toFixed(2)}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="border-t pt-4">
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Subtotal</span>
                            <span>Rs {subtotal.toFixed(2)}</span>
                          </div>

                          {currentStep > 2 && (
                            <div className="flex justify-between mb-2">
                              <span className="text-gray-600">Shipping</span>
                              <span>
                                {subtotal > FREE_SHIPPING_THRESHOLD
                                  ? "Free"
                                  : distanceDetails?.deliveryCharge
                                    ? `Rs ${distanceDetails.deliveryCharge}`
                                    : "Free"}
                              </span>
                            </div>
                          )}

                          {/* Shipping message */}
                          {subtotal < FREE_SHIPPING_THRESHOLD && (
                            <div className="text-sm text-right text-red-500 font-bold mb-2">
                              Add Rs{" "}
                              {(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)}{" "}
                              more to get free shipping
                            </div>
                          )}

                          <div className="flex justify-between font-bold text-lg mt-4">
                            <span>Total</span>
                            <span>
                              Rs{" "}
                              {(
                                subtotal +
                                (subtotal > FREE_SHIPPING_THRESHOLD
                                  ? 0
                                  : distanceDetails?.deliveryCharge || 0)
                              )?.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default withLayout(CheckOutPage);
