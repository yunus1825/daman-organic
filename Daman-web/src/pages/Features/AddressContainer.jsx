import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { message } from "antd";
import {
  addAddress,
  updateAddress,
  deleteAddress,
  clearAddressError,
} from "../../redux/slices/addressSlice";
import AddressList from "./components/AddressList";
import AddressForm from "./components/AddressForm";
import { useNavigate } from "react-router-dom";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY;
const AddressContainer = () => {
  const dispatch = useDispatch();
  const { addresses, loading, error, operationLoading } = useSelector(
    (state) => state.address
  );
  const formRef = useRef(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      addressType: "Work",
      flatNo: "",
      city: "",
      area: "",
      address: "",
      landmark: "",
      pincode: "",
      phoneNo: "",
      street: "",
      appartment_name: "",
      latitude: null,
      longitude: null,
    },
  });

  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const userId = useSelector((state) => state.auth?.user?._id);
  const [openCart, setOpenCart] = useState(false);
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);

  useEffect(() => {
    const shouldOpen =
      sessionStorage.getItem("shouldOpenAddressForm") === "true";
    if (shouldOpen) {
      setIsAdding(true);
      scrollToForm();
      sessionStorage.removeItem("shouldOpenAddressForm");
      sessionStorage.setItem("shouldOpenAddressCart", "true");
      setOpenCart(true);
    }

    // return ()=>{
    //     sessionStorage.removeItem("shouldOpenAddressCart");
    // }
  }, []);

  const scrollToForm = () => {
    setTimeout(() => {
      const headerOffset = 100;
      const elementPosition =
        formRef.current?.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }, 100);
  };

  const scrollToTop = () => {
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 100);
  };

  const handleAddAddress = () => {
    setIsAdding(true);
    setEditingId(null);
    reset({
      addressType: "Work",
      flatNo: "",
      city: "",
      area: "",
      address: "",
      landmark: "",
      pincode: "",
      phoneNo: "",
      street: "",
      appartment_name: "",
      latitude: null,
      longitude: null,
    });
    scrollToForm();
  };

  const handleEditAddress = (address) => {
    setIsAdding(false);
    setEditingId(address._id);
    reset(address);
    scrollToForm();
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    dispatch(clearAddressError());
    scrollToTop();
    // Reset to default values
    reset({
      addressType: "Work",
      flatNo: "",
      city: "",
      area: "",
      address: "",
      landmark: "",
      pincode: "",
      phoneNo: "",
      street: "",
      appartment_name: "",
      latitude: null,
      longitude: null,
    });
    if (openCart) {
      navigate("/checkout");
    }
  };

  const onSubmit = async (data) => {
    if (!userId) {
      message.error("Please login before adding address");
      return;
    }
    const formData = {
      latitude: data.latitude,
      longitude: data.longitude,
      addressType: data.addressType,
      flatNo: data.flatNo,
      city: data.city,
      area: data.area,
      customer_name: data.customer_name,
      email: data.email,
      address: data.address,
      landmark: data.landmark,
      pincode: data.pincode,
      phoneNo: data.phoneNo,
      street: data.street,
      appartment_name: data.appartment_name,
    };
    try {
      if (isAdding) {
        await dispatch(addAddress({ userId, addressData: formData })).unwrap();
        if (openCart) {
          navigate("/checkout");
        }
      } else {
        await dispatch(
          updateAddress({ userId, addressId: editingId, addressData: data })
        ).unwrap();
      }
      handleCancel();
    } catch (error) {
      message.error(error.message || "Something went wrong");
    }
  };

  const handleDeleteAddress = async (id) => {
    await dispatch(deleteAddress({ userId, addressId: id })).unwrap();
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    setLocationError(null);

    if (navigator.geolocation) {
      setIsFetchingAddress(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          setValue("latitude", position.coords.latitude);
          setValue("longitude", position.coords.longitude);
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
            );
            const data = await response.json();
            if (data?.results?.length > 0) {
              const address = data.results[0].formatted_address;
              setValue("address", address);

              // Extract pincode from Google Maps response
              const addressComponents = data.results[0].address_components;
              const pincodeComponent = addressComponents.find((component) =>
                component.types.includes("postal_code")
              );
              const pincode = pincodeComponent?.long_name || "Not available";
              setValue("pincode", pincode);

              const cityComponent = addressComponents.find((component) =>
                component.types.includes("administrative_area_level_3")
              );
              const city = cityComponent?.long_name || "Not available";
              setValue("city", city);

              console.log("Google Maps pincode:", pincode);
              console.log("Full Google address:", data.results[0]);
            } else {
              alert("No address found from your current location.");
            }
          } catch (err) {
            console.error("Geocoding error:", err);
            alert("Failed to retrieve address.");
          } finally {
            setIsFetchingAddress(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert(
            `Turn on Location Services to Allow "Daman" to Determine Your Location by Clicking the Location icon in the Address bar, and then Always allow.`
          );
          setLocationError(
            "Unable to retrieve your location: " + error.message
          );
        }
      );
    } else {
      setIsFetchingAddress(false);
      alert("Geolocation is not supported by this browser.");
    }
  };

  if (loading && addresses.length === 0) {
    return <div className="text-center py-8">Loading addresses...</div>;
  }

  // if (error) {
  //   return <div className="text-center py-8 text-red-500">{error}</div>;
  // }

  return (
    <div className="border-2 border-gray-300 rounded-xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-sm md:text-2xl font-bold text-gray-800">
          Your Addresses
        </h2>
        <button
          onClick={handleAddAddress}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primaryDark cursor-pointer transition-colors flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm md:text-lg">Add New Address</span>
        </button>
      </div>

      <AddressList
        addresses={addresses}
        onEdit={handleEditAddress}
        onDelete={handleDeleteAddress}
        onAddNew={handleAddAddress}
      />

      <AnimatePresence>
        {(isAdding || editingId) && (
          <AddressForm
            formRef={formRef}
            register={register}
            handleSubmit={handleSubmit}
            errors={errors}
            isSubmitting={isSubmitting || operationLoading}
            onSubmit={onSubmit}
            onCancel={handleCancel}
            getCurrentLocation={getCurrentLocation}
            locationError={locationError}
            isAdding={isAdding}
            setValue={setValue}
            isFetchingAddress={isFetchingAddress}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddressContainer;
