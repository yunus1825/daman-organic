import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CustomButton from "../globalComponents/CustomButton";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { message } from "antd";
import {
  updateStore,
  fetchStoreById,
  clearStoreDetails,
} from "../../redux/slices/storeManagementSlice";
import Loader from "../../components/Loader";
import ErrorComponent from "../../components/ErrorComponent";

const EditStore = () => {
  const [pincodeList, setPincodeList] = useState([""]);
  const [checkPin, setCheckPin] = useState("");
  const [pinExists, setPinExists] = useState(null);

  const { storeId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { storeDetails, loading, error } = useSelector((store) => store.stores);

  useEffect(() => {
    dispatch(fetchStoreById(storeId));
  }, [storeId]);

  useEffect(() => {
    if (!storeDetails) {
      dispatch(fetchStoreById(storeId)); // Fetch data if not already in store
    } else {
      reset({
        store_name: storeDetails.store_name,
        area: storeDetails.area,
        address: storeDetails.address,
        landmark: storeDetails.landmark,
        city: storeDetails.city,
        latitude: storeDetails.latitude,
        longitude: storeDetails.longitude,
        pincode: storeDetails.pincode,
      });
      setPincodeList(storeDetails?.pincodes?.map((p) => p.pincode.toString()));
    }
  }, [storeId, storeDetails, dispatch, reset]);

  useEffect(() => {
    return () => {
      dispatch(clearStoreDetails());
    };
  }, []);

  const submitData = async (data) => {
    try {
      const payload = {
        store_name: data.store_name,
        area: data.area,
        address: data.address,
        landmark: data.landmark,
        city: data.city,
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        pincode: parseInt(data.pincode),
        pincodes: pincodeList
          .filter((pin) => pin.trim() !== "")
          .map((pin) => ({ pincode: parseInt(pin) })),
      };

      dispatch(updateStore({ id: storeId, updatedData: payload, navigate }));
    } catch (error) {
      message.error(error.message || "Failed to update store.");
    }
  };

  const handleCheckPin = () => {
    if (pincodeList.includes(checkPin)) {
      setPinExists(true);
    } else {
      setPinExists(false);
    }
  };
  if (loading) return <Loader />;
  if (error) return <ErrorComponent message={error} />;
  return (
    <div className="form-container">
      <h2 className="form-title">Edit Store</h2>

      <form onSubmit={handleSubmit(submitData)} className="space-y-4">
        {/* Same fields as in AddStore... */}

        {/* store_name */}
        <div>
          <label className="form-label">Store Name</label>
          <input
            type="text"
            {...register("store_name", { required: "Store name is required" })}
            className="form-input"
            placeholder="Enter store name"
          />
          {errors.store_name && (
            <p className="text-red-500">{errors.store_name.message}</p>
          )}
        </div>

        {/* area */}
        <div>
          <label className="form-label">Area</label>
          <input
            type="text"
            {...register("area", { required: "Area is required" })}
            className="form-input"
            placeholder="Enter area"
          />
          {errors.area && <p className="text-red-500">{errors.area.message}</p>}
        </div>

        {/* address */}
        <div>
          <label className="form-label">Address</label>
          <input
            type="text"
            {...register("address", { required: "Address is required" })}
            className="form-input"
            placeholder="Enter address"
          />
          {errors.address && (
            <p className="text-red-500">{errors.address.message}</p>
          )}
        </div>

        {/* landmark */}
        <div>
          <label className="form-label">Landmark</label>
          <input
            type="text"
            {...register("landmark", { required: "Landmark is required" })}
            className="form-input"
            placeholder="Enter landmark"
          />
          {errors.landmark && (
            <p className="text-red-500">{errors.landmark.message}</p>
          )}
        </div>

        {/* city */}
        <div>
          <label className="form-label">City</label>
          <input
            type="text"
            {...register("city", { required: "City is required" })}
            className="form-input"
            placeholder="Enter city"
          />
          {errors.city && <p className="text-red-500">{errors.city.message}</p>}
        </div>

        {/* latitude */}
        <div>
          <label className="form-label">Latitude</label>
          <input
            type="number"
            step="any"
            {...register("latitude", {
              required: "Latitude is required",
              valueAsNumber: true,
              min: { value: -90, message: "Latitude must be >= -90" },
              max: { value: 90, message: "Latitude must be <= 90" },
            })}
            className="form-input"
            placeholder="Enter latitude"
          />
          {errors.latitude && (
            <p className="text-red-500">{errors.latitude.message}</p>
          )}
        </div>

        {/* longitude */}
        <div>
          <label className="form-label">Longitude</label>
          <input
            type="number"
            step="any"
            {...register("longitude", {
              required: "Longitude is required",
              valueAsNumber: true,
              min: { value: -180, message: "Longitude must be >= -180" },
              max: { value: 180, message: "Longitude must be <= 180" },
            })}
            className="form-input"
            placeholder="Enter longitude"
          />
          {errors.longitude && (
            <p className="text-red-500">{errors.longitude.message}</p>
          )}
        </div>

        {/* pincode */}
        <div>
          <label className="form-label">Store Pincode</label>
          <input
            type="number"
            {...register("pincode", {
              required: "Store Pincode is required",
              min: { value: 100000, message: "Invalid pincode" },
            })}
            className="form-input"
            placeholder="Enter main pincode"
          />
          {errors.pincode && (
            <p className="text-red-500">{errors.pincode.message}</p>
          )}
        </div>

        {/* ✅ Check Pincode Section */}
        <div>
          <label className="form-label">Check Pincode</label>
          <div className="flex space-x-2">
            <input
              type="number"
              value={checkPin}
              onChange={(e) => {
                setCheckPin(e.target.value);
                setPinExists(null); // 👈 hide message while typing
              }}
              className="form-input"
              placeholder="Enter pincode to check"
            />
            <button
              type="button"
              onClick={handleCheckPin}
              className="text-blue-500 cursor-pointer"
            >
              Check
            </button>
          </div>
          {pinExists === true && (
            <p className="text-green-500">✅ Pincode is available</p>
          )}
          {pinExists === false && (
            <p className="text-red-500">❌ Pincode not found</p>
          )}
        </div>

        {/* Pincodes list */}
        <div>
          <label className="form-label">Pincodes</label>
          {pincodeList?.map((pin, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <input
                type="number"
                value={pin}
                onChange={(e) => {
                  const updatedPins = [...pincodeList];
                  updatedPins[index] = e.target.value;
                  setPincodeList(updatedPins);
                }}
                className="form-input"
                placeholder="Enter 6-digit pincode"
                min="100000"
                max="999999"
                required
              />
              {pincodeList.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setPincodeList(pincodeList.filter((_, i) => i !== index))
                  }
                  className="text-red-500"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => setPincodeList([...pincodeList, ""])}
            className="text-blue-500 mt-1"
          >
            + Add Another Pincode
          </button>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <CustomButton
            label={loading ? "Updating..." : "Update"}
            variant="save"
            loading={loading}
          />
        </div>
      </form>
    </div>
  );
};

export default EditStore;
