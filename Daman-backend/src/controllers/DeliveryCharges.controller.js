import DeliveryCharges from "../models/DeliveryCharges.model.js";

// * Create DeliveryCharges * // 
export const createDeliveryCharges = async (req, res) => {
  try {
    const { tittle, kms, charges } = req.body;

    const existingDeliveryCharges = await DeliveryCharges.findOne({ tittle, kms, charges });

    if (existingDeliveryCharges) {
      return res.status(200).json({
        code: 200,
        status: "Bad Request",
        data: { error: "DeliveryCharges already exists for the given city and area" },
      });
    }

    const newDeliveryCharges = new DeliveryCharges({
        tittle,
        kms,
        charges,
    });
    const response = await newDeliveryCharges.save();

    res.status(200).json({
      code: 200,
      status: "Success!",
      message:"Charges added successfully",
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
// Get All DeliveryChargess
export const getAllDeliveryChargess = async (req, res) => {
  try {
    const response = await DeliveryCharges.find();

    res.status(200).json({
      code: 200,
      status: "Success!",
      message:"Charges List fetch successfully",
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
// Get DeliveryCharges By ID
export const getDeliveryChargesById = async (req, res) => {
  try {
    const response = await DeliveryCharges.findById(req.params.DeliveryChargesById);
    if (!response) {
      res.status(404).json({ code: 404, status: "DeliveryCharges not found", data: {} });
      return;
    }
    res.status(200).json({
      code: 200,
      status: "Success!",
      message:"Charges Details fetch successfully",
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
// Update DeliveryCharges
export const updateDeliveryChargesById = async (req, res) => {
  try {
    const response = await DeliveryCharges.findByIdAndUpdate(req.params.DeliveryChargesById, req.body, {
      new: true,
    });
    if (!response) {
      res.status(404).json({ code: 404, status: "DeliveryCharges not found", data: {} });
      return;
    }
    res.status(200).json({
      code: 200,
      status: "Success!",
      message:"Charges Update successfully",
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
// Delete DeliveryCharges
export const deleteDeliveryChargesById = async (req, res) => {
  try {
    const response = await DeliveryCharges.findByIdAndDelete(req.params.DeliveryChargesById);
    if (!response) {
      res.status(404).json({ code: 404, status: "DeliveryCharges not found", data: {} });
      return;
    }
    res.status(200).json({
      code: 200,
      status: "Success!",
      message:"Charges Detele successfully",
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