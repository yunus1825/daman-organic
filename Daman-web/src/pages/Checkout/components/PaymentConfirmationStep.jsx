import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import Razorpay from "razorpay"; // You don't need to import like this in frontend, Razorpay script should be included in HTML
import { message, Spin } from "antd";
import { clearCart } from "../../../redux/slices/cartSlice";
import { MySpinner } from "../../../components/global/AntSpinner";
import Modal from "react-modal";
import { FREE_SHIPPING_THRESHOLD } from "../../../constants/constants";
const typeColors = {
  Home: "bg-blue-100 text-blue-800",
  Work: "bg-purple-100 text-purple-800",
  Others: "bg-gray-100 text-gray-800",
};

const RazorpayKey = import.meta.env.VITE_REACT_APP_RAZORPAY_KEY;

export default function PaymentConfirmationStep({
  cart,
  selectedAddress,
  selectedPayment,
  prevStep,
  distanceDetails,
}) {
  const [isLoadingCheckOut, setIsLoadingCheckOut] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState("standard"); // 'standard' or 'scheduled'
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState("");
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const timeSlots = [
    { id: 1, label: "Morning (10 AM - 1 PM)" },
    { id: 2, label: "Afternoon (1 PM - 5 PM)" },
    { id: 3, label: "Evening (5 PM - 9 PM)" },
  ];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userDetails = useSelector((state) => state.auth.user);
  useEffect(() => {
    return () => {
      setIsLoadingCheckOut(false);
    };
  }, []);

  const getItemPrice = (item) => {
    return item.product?.variantData
      ? item.product.variantData.selling_Price
      : item.product?.selling_price;
  };

  const subtotal = cart.reduce((sum, item) => {
    const price = getItemPrice(item);
    return sum + price * item.quantity;
  }, 0);
  console.log(subtotal, "subtotal");
  const handlePlaceOrder = async () => {
    const userId = userDetails._id ? userDetails._id : null;

    if (!userId) {
      alert("Login Required", "You must be logged in to place an order.");
      return;
    }
    if (!selectedAddress._id) {
      alert("Address Required", "Please select address.");
      return;
    }
    if (cart.length === 0) {
      alert("Cart Empty", "Add some services before placing an order.");
      return;
    }
    if (!selectedPayment.id) {
      alert("Payment Required", "Please select a payment method.");
      return;
    }

    if (selectedPayment.id === 1) {
      // Online payment (uPayments)
      await handleOnlinePayment(userId, subtotal, userDetails);
    } else {
      // Proceed with COD or other payment types
      await placeCodOrder(userId, subtotal);
    }
  };

  const handleOnlinePayment = async (userId, totalAmount, userDetails) => {
    try {
      setIsLoadingCheckOut(true);
      // 1. Create order on your backend
      const response = await api.post(
        "/api/damanorganic/order_booking_by_user",
        {
          userId,
          addressId: selectedAddress._id,
          totalPrice:
            subtotal +
            (subtotal < FREE_SHIPPING_THRESHOLD
              ? distanceDetails?.deliveryCharge || 0
              : 0),
          paymentType: "Online",
          deliveryCharge:
            subtotal < FREE_SHIPPING_THRESHOLD
              ? distanceDetails?.deliveryCharge || 0
              : 0,
          storeId: distanceDetails?.storeId,
          scheduleTime: deliveryTimeSlot,
          scheduleDate: deliveryDate,
        },
      );
      if (response.data?.code === 200) {
        const orderId = response?.data?.data?.results?.ordId || null;

        const orderResponse = await api.post(
          "/api/damanorganic/create-razorpay-order",
          {
            amount:
              (subtotal +
                (subtotal > FREE_SHIPPING_THRESHOLD
                  ? 0
                  : distanceDetails?.deliveryCharge || 0)) *
              100,
          },
        );

        const razorOrderId = orderResponse.data.orderId;
        // 2. Trigger Razorpay payment
        const razorpayOptions = {
          key: RazorpayKey, // Replace with your key
          amount:
            (subtotal +
              (subtotal > FREE_SHIPPING_THRESHOLD
                ? 0
                : distanceDetails?.deliveryCharge || 0)) *
            100, // Razorpay uses paise
          // amount: 100, // Razorpay uses paise
          currency: "INR",
          name: "Daman organic living",
          description: `Order Payment for the order `,
          order_id: razorOrderId, // From backend
          handler: async function (paymentResponse) {
            // console.log(paymentResponse, "razorpay response");
            try {
              const response = await api.put(
                `/api/damanorganic/payment_status_success/${orderId}`,
                {
                  paymentId: paymentResponse?.razorpay_payment_id,
                },
              );
              if (response.data.code === 200) {
                navigate(`/payment-status/success/${orderId}`);
                window.scrollTo(0, 0); // Scroll to top of the page
                dispatch(clearCart());
                message.success("Order placed successfully!");
              }
            } catch (error) {
              const response = await api.put(
                `/api/damanorganic/payment_status_failed/${orderId}`,
              );
              if (response.data.code === 200) {
                navigate(`/payment-status/failure/${orderId}`);
                window.scrollTo(0, 0); // Scroll to top of the page
                dispatch(clearCart());
                message.error("Failed to verify payment.");
              }
            }
          },
          prefill: {
            name: userDetails.name,
            email: userDetails.email,
            contact: userDetails.phone,
          },
          theme: {
            color: "#3399cc",
          },
          modal: {
            ondismiss: async function () {
              setIsLoadingCheckOut(false);
              message.warning(
                "Payment was not completed. You exited the payment window.",
              );
              // try {
              //   const res = await api.put(
              //     `/api/damanorganic/payment_status_failed/${orderId}`
              //   );
              //   if (res.data.code === 200) {
              //     navigate(`/payment-status/failure/${orderId}`);
              //     window.scrollTo(0, 0);
              //     dispatch(clearCart());
              //   }
              // } catch (error) {
              //   console.error("Error updating payment failure", error);
              // }
            },
          },
        };

        const rzp = new window.Razorpay(razorpayOptions);
        rzp.open();
      } else {
        throw new Error("Failed to place order");
      }
    } catch (err) {
      message.error("Failed to initiate online payment.");
      console.error(err);
      setIsLoadingCheckOut(false);
    }
  };

  // Helper function for creating orders (used for COD and online payments)
  const placeCodOrder = async (userId, totalAmount) => {
    try {
      setIsLoadingCheckOut(true);
      const response = await api.post(
        "/api/damanorganic/order_booking_by_user",
        {
          userId,
          addressId: selectedAddress._id,
          totalPrice:
            subtotal +
            (subtotal < FREE_SHIPPING_THRESHOLD
              ? distanceDetails?.deliveryCharge || 0
              : 0),
          paymentType: "COD",
          deliveryCharge:
            subtotal < FREE_SHIPPING_THRESHOLD
              ? distanceDetails?.deliveryCharge || 0
              : 0,
          storeId: distanceDetails?.storeId,
          scheduleTime: deliveryTimeSlot,
          scheduleDate: deliveryDate,
        },
      );
      if (response.data.code === 200) {
        const orderId = response.data.data.results.ordId || null;
        navigate(`/payment-status/cod/${orderId}`);
        window.scrollTo(0, 0); // Scroll to top of the page
        dispatch(clearCart());
        message.success("Order placed successfully!");
      } else {
        throw new Error("Failed to place order");
      }
    } catch (err) {
      message.error(err.response.data.message || "Failed to place order.");
      console.error(err.response.data.message || "Failed to place order.");
      setIsLoadingCheckOut(false);
    }
  };
  const getMinDate = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };
  const customModalStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      maxWidth: "500px",
      width: "90%",
      borderRadius: "8px",
      padding: "20px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 1000,
    },
  };
  return (
    <div>
      <Modal
        isOpen={isDeliveryModalOpen}
        onRequestClose={() => setIsDeliveryModalOpen(false)}
        style={customModalStyles}
        contentLabel="Schedule Delivery Modal"
        ariaHideApp={false}
      >
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800">
            Schedule Your Delivery
          </h2>

          <div>
            <label
              htmlFor="deliveryDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Delivery Date
            </label>
            <input
              type="date"
              id="deliveryDate"
              min={getMinDate()}
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Time Slot
            </label>
            <div className="space-y-2">
              {timeSlots.map((slot) => (
                <div key={slot.label} className="flex items-center">
                  <input
                    type="radio"
                    id={`timeSlot${slot.label}`}
                    name="deliveryTimeSlot"
                    value={slot.label}
                    checked={deliveryTimeSlot === slot.label}
                    onChange={() => setDeliveryTimeSlot(slot.label)}
                    className="h-4 w-4 text-primary focus:ring-primary"
                    required
                  />
                  <label
                    htmlFor={`timeSlot${slot.label}`}
                    className="ml-2 block text-sm text-gray-700"
                  >
                    {slot.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setIsDeliveryModalOpen(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (deliveryDate && deliveryTimeSlot) {
                  setDeliveryOption("scheduled");
                  setIsDeliveryModalOpen(false);
                } else {
                  message.warning("Please select both date and time slot");
                }
              }}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primaryDark"
            >
              Confirm Schedule
            </button>
          </div>
        </div>
      </Modal>

      <h2 className="text-xl font-bold text-gray-800 mb-4">Confirm Payment</h2>

      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Order Summary</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          {cart?.map((item) => {
            const price = getItemPrice(item);
            const variant = item.product?.variantData;
            const unit_value = variant
              ? variant.quantity
              : item?.product.quantity;
            const unit_type = variant ? variant.Type : item?.product.Type;

            return (
              <div
                key={item._id}
                className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0"
              >
                <div>
                  <p className="font-medium">{item.product?.prd_Name}</p>
                  <p className="text-sm text-gray-500">
                    {`${unit_value} ${unit_type}`}
                  </p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <span>Rs {(price * item.quantity)?.toFixed(2)}</span>
              </div>
            );
          })}

          <div className="border-t pt-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span>Rs {subtotal?.toFixed(2)}</span>
            </div>

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

            {/* Shipping message */}
            {subtotal < FREE_SHIPPING_THRESHOLD && (
              <div className="text-sm text-red-500 font-bold text-right  mb-2">
                Add Rs {(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)} more to
                get free shipping
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
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Shipping Address</h3>
        {selectedAddress && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className={`relative p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer border-primary bg-blue-50`}
          >
            <div className="mb-4">
              <span
                className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                  typeColors[selectedAddress.addressType]
                }`}
              >
                {selectedAddress.addressType}
              </span>
              {selectedAddress.appartment_name && (
                <p className="font-medium mt-2">
                  {selectedAddress.appartment_name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-gray-600">
                {selectedAddress.flatNo}, {selectedAddress.street}
              </p>
              <p className="text-gray-600">{selectedAddress.selectedAddress}</p>
              <p className="text-gray-600">
                {selectedAddress.area}, {selectedAddress.city} -{" "}
                {selectedAddress.pincode}
              </p>
              <p className="text-gray-600">
                Landmark: {selectedAddress.landmark}
              </p>
              <p className="text-gray-600">Phone: {selectedAddress.phoneNo}</p>
            </div>
          </motion.div>
        )}
      </div>
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Delivery Options</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="standardDelivery"
                name="deliveryOption"
                value="standard"
                checked={deliveryOption === "standard"}
                onChange={() => setDeliveryOption("standard")}
                className="h-4 w-4 text-primary focus:ring-primary"
              />
              <label
                htmlFor="standardDelivery"
                className="ml-2 block text-sm font-medium text-gray-700"
              >
                Standard Delivery (Next available slot)
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="radio"
                id="scheduledDelivery"
                name="deliveryOption"
                value="scheduled"
                checked={deliveryOption === "scheduled"}
                onChange={() => setIsDeliveryModalOpen(true)}
                className="h-4 w-4 text-primary focus:ring-primary"
              />
              <label
                htmlFor="scheduledDelivery"
                className="ml-2 block text-sm font-medium text-gray-700"
              >
                Schedule Delivery
              </label>
            </div>

            {deliveryOption === "scheduled" &&
              deliveryDate &&
              deliveryTimeSlot && (
                <div className="pl-6 pt-2">
                  <p className="text-sm text-gray-700">
                    Scheduled for: {new Date(deliveryDate).toLocaleDateString()}{" "}
                    -{" "}
                    {
                      timeSlots.find((slot) => slot.label === deliveryTimeSlot)
                        ?.label
                    }
                  </p>
                </div>
              )}
          </div>
        </div>
      </div>
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Payment Method</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          {selectedPayment && (
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                {selectedPayment.icon}
                <span className="font-medium">{selectedPayment.type}</span>
              </div>
              {selectedPayment === selectedPayment.id && (
                <svg
                  className="w-5 h-5 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col space-y-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isLoadingCheckOut}
          onClick={handlePlaceOrder}
          className="w-full bg-primary flex justify-center cursor-pointer text-white py-3 rounded-lg font-medium hover:bg-primaryDark transition"
        >
          {isLoadingCheckOut ? <MySpinner /> : "Place Order"}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={prevStep}
          className="w-full bg-gray-200 text-gray-800 py-3 cursor-pointer rounded-lg font-medium hover:bg-gray-300 transition"
        >
          Back
        </motion.button>
      </div>
    </div>
  );
}
