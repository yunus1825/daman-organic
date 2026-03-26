// routes/marqueeRoutes.js
import express from "express";
import {
  createMarquee,
  getMarquees,
  getMarquee,
  updateMarquee,
  deleteMarquee,
} from "../controllers/Marquee.controller.js";

const router = express.Router();

router.post("/marquee", createMarquee);
router.get("/marquee", getMarquees);
router.get("/marquee/:id", getMarquee);
router.put("/marquee/:id", updateMarquee);
router.delete("/marquee/:id", deleteMarquee);

export default router;
