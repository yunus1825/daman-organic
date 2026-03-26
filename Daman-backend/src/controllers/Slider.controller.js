import Slider from "../models/Slider.model.js";
import cache from "../utils/cache.js";

// Add Slider
export const createSlider = async (req, res) => {
  try {
    const { Tittle, Description, Image } = req.body;
    // get last slider order
    const lastSlider = await Slider.findOne().sort({ order: -1 });
    const value = {
      Tittle,
      Description,
      Image,
      status: false,
      order: lastSlider ? lastSlider.order + 1 : 0,
    };

    const newSlider = new Slider(value);
    const response = await newSlider.save();
    cache.del("slider_data");

    res.status(200).json({
      code: 200,
      status: "Success!",
      message: "Slider Added successfully",
      data: { results: response },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      code: 500,
      status: "An error occurred! Check server logs for more info.",
      data: { error: error.message },
    });
  }
};

// List All Slider
export const getAllSlider = async (req, res) => {
  const responseData = cache.get("slider_data");
  if (responseData) {
    return res.status(200).json({
      code: 200,
      status: "Success!",
      message: "Slider List successfully",
      data: { length: responseData.length, results: responseData },
    });
  }
  try {
    const response = await Slider.find().sort({ order: 1 });
    cache.set("slider_data", response);
    res.status(200).json({
      code: 200,
      status: "Success!",
      message: "Slider List successfully",
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

// update sliders order
export const SliderOrderUpdate = async (req, res) => {
  try {
    const { order_json } = req.body;

    if (!Array.isArray(order_json) || order_json.length === 0) {
      return res.status(400).json({
        code: 400,
        status: "Bad Request",
        message: "order_json array is required",
      });
    }

    const updatePromises = order_json.map((item) =>
      Slider.findByIdAndUpdate(
        item.SliderId,
        { order: item.order },
        { new: true },
      ),
    );

    await Promise.all(updatePromises);

    const allSliders = await Slider.find().sort({ order: 1 });

    cache.del("slider_data");

    res.status(200).json({
      code: 200,
      status: "Success!",
      message: "Sliders order updated successfully",
      data: { results: allSliders },
    });
  } catch (error) {
    console.error("SliderOrderUpdate Error:", error);

    res.status(500).json({
      code: 500,
      status: "Server Error",
      data: {},
    });
  }
};

// Update Slider
export const updateSliderById = async (req, res) => {
  try {
    const response = await Slider.findByIdAndUpdate(
      req.params.SliderId,
      req.body,
      { new: true },
    );
    if (!response) {
      res.status(404).json({ code: 404, status: "Slider not found", data: {} });
      return;
    }
    cache.del("slider_data");

    res.status(200).json({
      code: 200,
      status: "Success!",
      message: "Slider Updated successfully",
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

// Slider Details
export const getSliderById = async (req, res) => {
  try {
    const response = await Slider.findById(req.params.SliderId);
    if (!response) {
      res.status(404).json({ code: 404, status: "Slider not found", data: {} });
      return;
    }
    res.status(200).json({
      code: 200,
      status: "Success!",
      message: "Slider Details successfully",
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

// Delete Slider
export const deleteSliderById = async (req, res) => {
  try {
    const response = await Slider.findByIdAndDelete(req.params.SliderId);
    if (!response) {
      // console.log(res);
      res.status(404).json({ code: 404, status: "Slider not found", data: {} });
      return;
    }
    cache.del("slider_data");

    res.status(200).json({
      code: 200,
      status: "Success!",
      message: "Slider Deleted successfully",
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
