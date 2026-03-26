import React from 'react';
import { motion } from 'framer-motion';

const typeColors = {
  Home: 'bg-blue-100 text-blue-800',
  Work: 'bg-purple-100 text-purple-800',
  Others: 'bg-gray-100 text-gray-800',
};

const AddressCard = ({ address, onEdit, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className={`relative p-6 rounded-xl border border-primary shadow-sm hover:shadow-md transition-shadow`}
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

      <div className="mt-6 flex gap-2">
        <button
          onClick={() => onEdit(address)}
          className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-800 transition-all cursor-pointer hover:bg-blue-100 rounded"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(address._id)}
          className="px-3 py-1 text-sm text-red-600 hover:text-red-800 transition-all cursor-pointer hover:bg-red-100 rounded"
        >
          Delete
        </button>
      </div>
    </motion.div>
  );
};

export default AddressCard;