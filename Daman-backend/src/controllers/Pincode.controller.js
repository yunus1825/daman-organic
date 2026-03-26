import Pincode from "../models/Pincode.model.js";


// * Create Pincode * // 
export const createPincode = async (req, res) => {
  try {
    const { city, area, pincode, status } = req.body;

    const existingPincode = await Pincode.findOne({ city, area, pincode });

    if (existingPincode) {
      return res.status(200).json({
        code: 200,
        status: "Bad Request",
        data: { error: "Pincode already exists for the given city and area" },
      });
    }

    const newPincode = new Pincode({
      city,
      area,
      pincode,
      status,
    });
    const response = await newPincode.save();

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

// Get All Pincodes
export const getAllPincodes = async (req, res) => {
  try {
    const response = await Pincode.find();

    res.status(200).json({
      code: 200,
      status: "Success!",
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

// Get Pincode By ID
export const getPincodeById = async (req, res) => {
  try {
    const response = await Pincode.findById(req.params.PincodeById);
    if (!response) {
      res.status(404).json({ code: 404, status: "Pincode not found", data: {} });
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

// Update Pincode
export const updatePincodeById = async (req, res) => {
  try {
    const response = await Pincode.findByIdAndUpdate(req.params.PincodeById, req.body, {
      new: true,
    });
    if (!response) {
      res.status(404).json({ code: 404, status: "Pincode not found", data: {} });
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

// Delete Pincode
export const deletePincodeById = async (req, res) => {
  try {
    const response = await Pincode.findByIdAndDelete(req.params.PincodeByid);
    if (!response) {
      res.status(404).json({ code: 404, status: "Pincode not found", data: {} });
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
// Active Pincodes 
export const getAllActivePincodes = async (req, res) => {
  try {
    const response = await Pincode.find({status:true});

    res.status(200).json({
      code: 200,
      status: "Success!",
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
// Status Update Api 
export const updatePincodeStatusById = async (req, res) => {
  try {
    // Find the Pincode by ID
    const pincode = await Pincode.findById(req.params.PincodeById);

    if (!pincode) {
      return res.status(404).json({
        code: 404,
        status: "Pincode not found",
        data: {},
      });
    }

    // Toggle the status
    pincode.status = !pincode.status;

    // Save the updated Pincode
    await pincode.save();

    res.status(200).json({
      code: 200,
      status: "Success!",
      message: `Pincode status updated to ${pincode.status ? 'Active' : 'Inactive'}`,
      data: { results: pincode },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: 500,
      status: "An error occurred! Check server logs for more info.",
      data: {},
    });
  }
};
