import React, { useState } from "react";
import { useForm } from "react-hook-form";
import CustomButton from "../globalComponents/CustomButton";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addPincodes } from "../../redux/slices/pincodesSlice";

const AddPincode = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  // Handle image selection


  const dispatch = useDispatch();
  // Function to submit brand details
  const submitBrandDetails = async (data) => {
    try {
      setLoading(true);

 
      dispatch(
        addPincodes({
          navigate,
          setLoading,
          PincodeData: {
            city: data.City,
            area:data.Area,
            pincode:data.Pincode,

          },
        })
      );
    } catch (error) {
      alert(error.message || "Something went wrong!");
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Add Pincode</h2>

      <form
        onSubmit={handleSubmit((data) => {
          submitBrandDetails(data);
        })}
        className="space-y-4"
      >
        {/* Title Field */}
        <div>
          <label className="form-label">City</label>
          <input
            type="text"
            {...register("City", { required: "City is required" })}
            className="form-input"
            placeholder="Enter brand City"
          />
          {errors.City && (
            <p className="form-error-text">{errors.City.message}</p>
          )}
        </div>
        <div>
          <label className="form-label">Area</label>
          <input
            type="text"
            {...register("Area", {
              required: "Area is required",
            })}
            className="form-input"
            placeholder="Enter brand Area"
          />
          {errors.Area && (
            <p className="form-error-text">{errors.Area.message}</p>
          )}
        </div>
        <div>
          <label className="form-label">Pincode</label>
          <input
            type="number"
            {...register("Pincode", { required: "Pincode is required" })}
            className="form-input"
            placeholder="Enter brand Pincode"
          />
          {errors.Pincode && (
            <p className="form-error-text">{errors.Pincode.message}</p>
          )}
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

export default AddPincode;
