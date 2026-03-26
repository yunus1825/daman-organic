import React from "react";
import { motion } from "framer-motion";

const typeColors = {
  Home: "bg-blue-100 text-blue-800",
  Work: "bg-purple-100 text-purple-800",
  Others: "bg-gray-100 text-gray-800",
};

const AddressCardCheckout = ({
  address,
  selectedAddress,
  setSelectedAddress,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      onClick={() => {
        setSelectedAddress(address);
        sessionStorage.removeItem("shouldOpenAddressCart");
      }}
      className={`relative p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer ${
        selectedAddress?._id === address?._id
          ? "border-primary bg-blue-50"
          : "border-gray-200"
      }`}
    >
      <div className="mb-4">
        <span
          className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
            typeColors[address.addressType]
          }`}
        >
          {address.addressType}
        </span>
        {address.appartment_name && (
          <p className="font-medium mt-2">{address.appartment_name}</p>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-gray-600">
          {address.flatNo}, {address.street}
        </p>
        <p className="text-gray-600">{address.address}</p>
        <p className="text-gray-600">
          {address.area}, {address.city} - {address.pincode}
        </p>
        <p className="text-gray-600">Landmark: {address.landmark}</p>
        <p className="text-gray-600">Phone: {address.phoneNo}</p>
      </div>
    </motion.div>
  );
};

export default AddressCardCheckout;
