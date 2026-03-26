import StoreManagement from "../models/StoreManagement.model.js";
// Add store

export const createStoreManagement = async (req, res) => {
    try {
        const { ...rest } = req.body;

        // If the StoreManagement doesn't exist, create a new StoreManagement item
        const newStoreManagement = new StoreManagement({
            ...rest
        });
        const response = await newStoreManagement.save();

        res.status(200).json({
            code: 200,
            status: "Success!",
            data: { results: response },
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            status: "An error occurred! Check server logs for more info.",
            data: { error: error.message },
        });
    }
};
// Store List
// Get All StoreManagements
export const getAllStoreManagements = async (req, res) => {
    try {
        const response = await StoreManagement.find();

        res.status(200).json({
            code: 200,
            status: "Success!",
            message: "Store List fetch successfully",
            data: { length: response.length, results: response },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            code: 500,
            status: "An error occurred! Check server logs for more info.",
            data: {},
        });
    }
};
// Get StoreManagement By ID
export const getStoreManagementById = async (req, res) => {
    try {
        const response = await StoreManagement.findById(req.params.StoreManagementById);
        if (!response) {
            res.status(404).json({ code: 404, status: "Store not found", data: {} });
            return;
        }
        res.status(200).json({
            code: 200,
            status: "Success!",
            message: "Store Details fetch successfully",
            data: { results: response },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            code: 500,
            status: "An error occurred! Check server logs for more info.",
            data: {},
        });
    }
};
// Store Update
export const updateStoreManagementById = async (req, res) => {
    try {
        const response = await StoreManagement.findByIdAndUpdate(
            req.params.StoreManagementById,
            req.body,
            { new: true }
        );
        if (!response) {
            res
                .status(404)
                .json({ code: 404, status: "Stor not found", data: {} });
            return;
        }
        res.status(200).json({
            code: 200,
            status: "Success!",
            data: { results: response },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            code: 500,
            status: "An error occurred! Check server logs for more info.",
            data: {},
        });
    }
};

// Delete StoreManagement
export const deleteStoreManagementById = async (req, res) => {
    try {
        const response = await StoreManagement.findByIdAndDelete(req.params.StoreManagementById);
        if (!response) {
            res.status(404).json({ code: 404, status: "Store not found", data: {} });
            return;
        }
        res.status(200).json({
            code: 200,
            status: "Success!",
            message: "Store Detele successfully",
            data: { results: response },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            code: 500,
            status: "An error occurred! Check server logs for more info.",
            data: {},
        });
    }
};