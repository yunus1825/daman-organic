import express from "express";
import {
  createCart,
  getAllCart,
  deleteCartById,
  getAllUserCart,
  getAllCartdetails,
} from "../controllers/Cart.controller.js";


const router = express.Router();
router.put("/cart/:userId", createCart);
router.get("/cart/:userId", getAllCart);
router.delete("/cart/:cartId", deleteCartById);
router.get("/users_cart_list", getAllUserCart);
router.get("/cart_details/:userId", getAllCartdetails);



export default router;
