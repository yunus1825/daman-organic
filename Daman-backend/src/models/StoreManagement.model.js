import mongoose from "mongoose";

const StoreManagementSchema = new mongoose.Schema(
    {
        store_name: {
            type: String,
            required: [true, "city required!"],

        },
        area: {
            type: String,
            required: [true, "area required! "],
            // unique: true,

        },
        address: {
            type: String,
            required: [true, "area required! "],
            // unique: true,

        },
        landmark: {
            type: String,
            required: [true, "area required! "],

        },
        city: {
            type: String,
            required: [true, "area required! "],

        },
        latitude: {
            type: Number,
            required: [false, "latitude required!"],
            default: null,
        },
        longitude: {
            type: Number,
            required: [false, "longitude required!"],
            default: null,
        },
        pincode: {
            type: Number,
            required: [true, "Pincode required!"],
            // unique: true,
        },
        pincodes: [
            {
                pincode: {
                    type: String,
                    required: [false, "Pincode required!"],
                    trim: true,
                },
            },
        ],
        status: {
            type: Boolean,
            required: [true, "status required"],
            default: true,
        }

    },
    {
        timestamps: true,
    }
);

const StoreManagement = mongoose.model("colStoreManagement", StoreManagementSchema);

export default StoreManagement;
