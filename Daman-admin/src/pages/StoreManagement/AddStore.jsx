import React, { useState } from "react";
import { useForm } from "react-hook-form";
import CustomButton from "../globalComponents/CustomButton";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { addStore } from "../../redux/slices/storeManagementSlice";

const AddStore = () => {
  const [loading, setLoading] = useState(false);
  const [pincodeList, setPincodeList] = useState([""]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submitData = async (data) => {
    try {
      setLoading(true);

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

      dispatch(addStore({ navigate, setLoading, storeData: payload }));
    } catch (error) {
      message.error(error.message || "Something went wrong!");
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Add Store</h2>

      <form onSubmit={handleSubmit(submitData)} className="space-y-4">
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

        {/* pincodes list */}
        <div>
          <label className="form-label">Pincodes</label>
          {pincodeList.map((pin, index) => (
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
                  onClick={() => {
                    setPincodeList(pincodeList.filter((_, i) => i !== index));
                  }}
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
            label={loading ? "Submitting..." : "Submit"}
            variant="save"
            loading={loading}
          />
        </div>
      </form>
    </div>
  );
};

export default AddStore;
