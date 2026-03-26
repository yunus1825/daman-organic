import React from "react";
import { AnimatePresence } from "framer-motion";
import AddressCard from "./AddressCard";

const AddressList = ({ addresses, onEdit, onDelete }) => {
  if (addresses.length === 0) {
    return (
      <div className="text-center py-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 mx-auto text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          No addresses saved
        </h3>
        <p className="mt-1 text-gray-500">
          You haven't added any addresses yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <AnimatePresence>
        {addresses.map((address) => (
          <AddressCard
            key={address._id}
            address={address}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default AddressList;
