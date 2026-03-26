// components/AddressPaymentStep.jsx
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { FaCreditCard } from "react-icons/fa";
import { MdOutlineAttachMoney } from "react-icons/md";
import { useEffect, useState } from "react";
import RouterLink from "../../../components/global/RouterLink";
import AddressCardCheckout from "./AddressCardCheckout";
import api from "../../../utils/api";
import { MySpinner } from "../../../components/global/AntSpinner";

const paymentMethods = [
  { id: 1, type: "Online", icon: <FaCreditCard className="text-xl mr-2" /> },
  {
    id: 2,
    type: "COD",
    icon: <MdOutlineAttachMoney className="text-xl mr-2" />,
  },
];

export default function AddressPaymentStep({
  selectedAddress,
  selectedPayment,
  setSelectedAddress,
  setSelectedPayment,
  prevStep,
  nextStep,
  distanceDetails,
  setDistanceDetails,
}) {
  // Initial dummy data with address types

  const { addresses, loading, error } = useSelector((state) => state.address);
  const [shakeError, setShakeError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [distanceLoading, setDistanceLoading] = useState(false);

  // ✅ Auto-select if only one address
  useEffect(() => {
    if (addresses?.length === 1 && !selectedAddress) {
      setSelectedAddress(addresses[0]);
    }
  }, [addresses, selectedAddress, setSelectedAddress]);

  const handleContinue = async () => {
    if (!selectedAddress || !selectedPayment) {
      setShakeError(true);
      setErrorMessage(
        !selectedAddress && !selectedPayment
          ? "Please select an address and payment method."
          : !selectedAddress
          ? "Please select a delivery address."
          : "Please select a payment method."
      );

      setTimeout(() => {
        setShakeError(false);
        setErrorMessage(""); // Clear message after 1 second
      }, 1000);

      return;
    }

    try {
      setDistanceLoading(true);
      // 👇 Example API call to save address and payment method
      const response = await api.get(
        `/api/damanorganic/ord_distance/${selectedAddress._id}`
      );

      // Optional: Check for success response
      if (response.data.code === 200) {
        setDistanceDetails(response.data.data || {});
        nextStep(); // Proceed to next step only if API call succeeds
      } else {
        throw new Error("Failed to save selection. Please try again.");
      }
    } catch (err) {
      setShakeError(true);
      setErrorMessage(
        err.response?.data?.message || err.message || "Something went wrong."
      );

      setTimeout(() => {
        setShakeError(false);
        setErrorMessage("");
      }, 2000);
    } finally {
      setDistanceLoading(false);
    }
  };

  const shakeVariants = {
    shake: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.4 },
    },
  };
  if (loading) {
    <p className="text-center">Loading...</p>;
  }
  if (error) {
    <p className="text-center">{error}</p>;
  }
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Shipping & Payment
      </h2>

      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-3">Select Address</h3>
        <div className="space-y-3">
          {addresses?.map((address) => (
            <AddressCardCheckout
              address={address}
              setSelectedAddress={setSelectedAddress}
              selectedAddress={selectedAddress}
            ></AddressCardCheckout>
          ))}
          <RouterLink
            to="/profile/address"
            onClick={() => {
              sessionStorage.setItem("shouldOpenAddressForm", "true");
              window.scrollTo({ top: 0, behavior: "instant" });
            }}
            className="w-full py-2 text-primary hover:text-primaryDark cursor-pointer font-medium flex items-center justify-center"
          >
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add New Address
          </RouterLink>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-3">Payment Method</h3>
        <div className="flex space-x-3 items-center">
          {paymentMethods.map((method) => (
            <motion.div
              key={method.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setSelectedPayment(method)}
              className={`p-4 border w-full rounded-lg cursor-pointer ${
                selectedPayment?.id === method?.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200"
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  {method.icon}
                  <span className="font-medium">{method.type}</span>
                </div>
                {selectedPayment === method.id && (
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
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex flex-col space-y-2">
        <div className="flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={prevStep}
            className="flex-1 bg-gray-200 text-gray-800 py-3 cursor-pointer rounded-lg font-medium hover:bg-gray-300 transition"
          >
            Back
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleContinue}
            variants={shakeVariants}
            disabled={distanceLoading}
            animate={shakeError ? "shake" : ""}
            className={`flex-1 py-3 rounded-lg font-medium transition ${
              shakeError
                ? "bg-red-100 text-red-800 border border-red-300"
                : "bg-primary hover:bg-primaryDark cursor-pointer text-white"
            }`}
          >
            {distanceLoading ? <MySpinner></MySpinner> : "Continue"}
          </motion.button>
        </div>

        {errorMessage && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-red-600 text-sm font-medium text-center"
          >
            {errorMessage}
          </motion.p>
        )}
      </div>
    </div>
  );
}
