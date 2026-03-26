// routes/paymentRoutes.js
import express from "express";
import { createRazorpayOrder } from "../controllers/Payment.controller.js";

const router = express.Router();

router.post("/create-razorpay-order", createRazorpayOrder);

export default router;
