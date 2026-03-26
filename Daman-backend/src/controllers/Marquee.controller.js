// controllers/marqueeController.js
import Marquee from "../models/marquee.model.js";
import cache from "../utils/cache.js";

// Create a new marquee
export const createMarquee = async (req, res) => {
  try {
    const { text, isActive } = req.body;
    const marquee = new Marquee({ text, isActive });
    await marquee.save();

    // Invalidate cache after create
    cache.del("marquees");

    res.status(201).json({
      code: 201,
      success: true,
      data: marquee,
    });
  } catch (error) {
    res.status(500).json({ code: 500, success: false, message: error.message });
  }
};

// Get all marquees
export const getMarquees = async (req, res) => {
  try {
    const cachedData = cache.get("marquees");
    if (cachedData) {
      return res.status(200).json({
        code: 200,
        success: true,
        data: cachedData,
        fromCache: true,
      });
    }

    const marquees = await Marquee.find();

    // Store in cache
    cache.set("marquees", marquees);

    res.status(200).json({ code: 200, success: true, data: marquees });
  } catch (error) {
    res.status(500).json({ code: 500, success: false, message: error.message });
  }
};

// Get single marquee by id
export const getMarquee = async (req, res) => {
  try {
    const { id } = req.params;

    const cachedData = cache.get(`marquee_${id}`);
    if (cachedData) {
      return res.status(200).json({
        code: 200,
        success: true,
        data: cachedData,
        fromCache: true,
      });
    }

    const marquee = await Marquee.findById(id);
    if (!marquee) {
      return res
        .status(404)
        .json({ code: 404, success: false, message: "Not found" });
    }

    // Cache the single marquee
    cache.set(`marquee_${id}`, marquee);

    res.status(200).json({ code: 200, success: true, data: marquee });
  } catch (error) {
    res.status(500).json({ code: 500, success: false, message: error.message });
  }
};

// Update marquee
export const updateMarquee = async (req, res) => {
  try {
    const { text, isActive } = req.body;
    const marquee = await Marquee.findByIdAndUpdate(
      req.params.id,
      { text, isActive },
      { new: true }
    );

    if (!marquee) {
      return res
        .status(404)
        .json({ code: 404, success: false, message: "Not found" });
    }

    // Invalidate related caches
    cache.del("marquees");
    cache.del(`marquee_${req.params.id}`);

    res.status(200).json({ code: 200, success: true, data: marquee });
  } catch (error) {
    res.status(500).json({ code: 500, success: false, message: error.message });
  }
};

// Delete marquee
export const deleteMarquee = async (req, res) => {
  try {
    const marquee = await Marquee.findByIdAndDelete(req.params.id);
    if (!marquee) {
      return res
        .status(404)
        .json({ code: 404, success: false, message: "Not found" });
    }

    // Invalidate related caches
    cache.del("marquees");
    cache.del(`marquee_${req.params.id}`);

    res.status(200).json({
      code: 200,
      success: true,
      data: { message: "Deleted successfully" },
    });
  } catch (error) {
    res.status(500).json({ code: 500, success: false, message: error.message });
  }
};
