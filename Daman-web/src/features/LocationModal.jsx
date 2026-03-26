import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiChevronDown, FiSearch, FiMapPin, FiX } from "react-icons/fi";
import { MdOutlineMyLocation } from "react-icons/md";
import { useSelector } from "react-redux";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY;
const LocationModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addresses, loading, error } = useSelector((state) => state.address);
  const [searchQuery, setSearchQuery] = useState("");
  const [savedLocations, setSavedLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
            );
            const data = await response.json();
            if (data?.results?.length > 0) {
              const address = data.results[0].formatted_address;

              // Extract pincode from Google Maps response
              const addressComponents = data.results[0].address_components;
              const pincodeComponent = addressComponents.find((component) =>
                component.types.includes("postal_code")
              );
              const pincode = pincodeComponent?.long_name || "Not available";

              console.log("Google Maps pincode:", pincode);
              console.log("Full Google address:", data.results[0]);

              setSelectedLocation(address);
              setIsModalOpen(false);
            } else {
              alert("No address found from your current location.");
            }
          } catch (err) {
            console.error("Geocoding error:", err);
            alert("Failed to retrieve address.");
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert(
            `Turn on Location Services to Allow "Daman" to Determine Your Location by Clicking the Location icon in the Address bar, and then Always allow.`
          );
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleSaveLocation = () => {
    if (searchQuery.trim() && !savedLocations.includes(searchQuery)) {
      setSavedLocations([...savedLocations, searchQuery]);
      setSelectedLocation(searchQuery);
      setSearchQuery("");
      setIsModalOpen(false);
    }
  };

  const handleSelectAddress = (address) => {
    const formatted = `${address.flatNo || ""} ${
      address.appartment_name || ""
    } ${address.address || ""} ${address.city || ""} ${address.area || ""} ${
      address.pincode || ""
    } ${address.landmark || ""} ${address.street || ""}`;

    // Log pincode from saved address
    console.log("Saved address pincode:", address.pincode);
    console.log("Full saved address:", address);

    setSelectedLocation(formatted.trim());
    setIsModalOpen(false);
  };
  return (
    <>
      {/* Location Selector Button */}
      <motion.button
        className="flex items-center text-md hover:text-primaryDark space-x-2 cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsModalOpen(true)}
      >
        <span className="truncate overflow-hidden text-nowrap max-w-[300px]">
          {selectedLocation || "Select Location"}
        </span>
        <FiChevronDown className="text-base" />
      </motion.button>

      {/* Modal Backdrop */}
      {isModalOpen && (
        <div
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 bg-blue-950/20 bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="flex justify-between shadow items-center p-4 ">
              <h3 className="text-lg font-bold">Select Location</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 cursor-pointer hover:text-gray-700"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-4 shadow">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for area, street name..."
                  className="w-full pl-10 pr-4 py-2 border-gray-300 border-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSaveLocation()}
                />
              </div>
            </div>

            {/* Current Location */}
            <div className="p-4 shadow">
              <button
                onClick={handleGetCurrentLocation}
                className="flex items-start cursor-pointer space-x-2 text-primaryDark hover:text-primaryDark w-full"
              >
                <MdOutlineMyLocation className="text-lg mt-2" />
                <div className="flex flex-col items-start">
                  <p className="font-bold">Current Location</p>
                  <p>Using GPS</p>
                </div>
              </button>
            </div>

            {/* Loading/Error States */}
            <div className="p-4">
              {loading && <p className="text-blue-500">Loading addresses...</p>}
              {error && <p className="text-red-500">Error: {error}</p>}
            </div>

            {/* Saved Locations */}
            <div className="p-4">
              <h4 className="text-sm font-bold mb-2">Saved Location</h4>
              <ul className="space-y-3">
                {addresses?.map((address, index) => (
                  <li key={index}>
                    <button
                      className="flex items-center space-x-2 w-full text-left hover:bg-blue-100 cursor-pointer p-2 rounded"
                      onClick={() => handleSelectAddress(address)}
                    >
                      <FiMapPin className="text-primaryDark" />
                      <span>
                        <p className="font-bold">{address.addressType}</p>
                        <p className="text-gray-500">
                          {address.flatNo} {address.appartment_name}{" "}
                          {address.address} {address.city} {address.area}{" "}
                          {address.pincode} {address.landmark} {address.street}
                        </p>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default LocationModal;
