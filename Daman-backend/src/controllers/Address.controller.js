import Address from "../models/Address.model.js";
import User from "../models/user.model.js";

//Create Address
export const createAddress = async (req, res) => {
  try {
    const { ...rest} = req.body;
    const { userId } = req.params;

    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({
        code: 404,
        status: "Failed",
        message: "User not found",
      });
    }

    // If the Address doesn't exist, create a new Address item
    const newAddress = new Address({
      userId,
      ...rest
    });
    const response = await newAddress.save();

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
// Get All Address
export const getAllAddress = async (req, res) => {
  try {
    const userId = req.params.userId;

    const response = await Address.find({ userId: userId });

    res.status(200).json({
      code: 200,
      status: "Success!",
      data: { length: response.length, results: response },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      code: 500,
      status:
        "An error occurred! Check server logs for more info is the error.",
      data: {},
    });
  }
};
// Get Address Detail By ID
export const getAddressById = async (req, res) => {
  try {
    const response = await Address.findById(req.params.AddressId);
    if (!response) {
      res
        .status(404)
        .json({ code: 404, status: "Address not found", data: {} });
      return;
    }
    res.status(200).json({
      code: 200,
      status: "Success!",
      data: {  length: response.length, results: response },
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
// Update Address
export const updateAddressById = async (req, res) => {
  try {
    const response = await Address.findByIdAndUpdate(
      req.params.AddressId,
      req.body,
      { new: true }
    );
    if (!response) {
      res
        .status(404)
        .json({ code: 404, status: "Address not found", data: {} });
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
// Delete Address
export const deleteAddressById = async (req, res) => {
  try {
    const response = await Address.findByIdAndDelete(
      req.params.AddressId
    );
    if (!response) {
      // console.log(res);
      res
        .status(404)
        .json({ code: 404, status: "Address not found", data: {} });
      return;
    }
    res.status(200).json({
      code: 200,
      status: "Success!",
      data: { results: response },
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      code: 500,
      status: "An error occurred! Check server logs for more info.",
      data: {},
    });
  }
};
