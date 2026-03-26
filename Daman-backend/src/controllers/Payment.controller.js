// controllers/paymentController.js
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body; // Amount in paise

    const options = {
      amount: Number(amount),
      currency: "INR",
      receipt: "receipt_" + Date.now(),
      payment_capture: 1, // Auto-capture
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      orderId: order.id,
    });
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    res.status(500).json({ success: false, message: "Razorpay order failed" });
  }
};
