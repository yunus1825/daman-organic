import express from "express";
import {
  createSlider,
  getAllSlider,
  updateSliderById,
  getSliderById,
  deleteSliderById,
  SliderOrderUpdate,
} from "../controllers/Slider.controller.js";

const router = express.Router();

router.post("/slider_add", createSlider);
router.get("/slider_list", getAllSlider);
router.put("/sliders_updateorder", SliderOrderUpdate);
router.get("/slider/:SliderId", getSliderById);
router.delete("/slider_del/:SliderId", deleteSliderById);
router.put("/slider_update/:SliderId", updateSliderById);

export default router;
