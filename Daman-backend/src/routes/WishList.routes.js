import express from "express";
import {
  addToWishList,
  getAllWishList,
  removeFromWishList,
} from "../controllers/WishList.controller.js";


const router = express.Router();
router.put("/add_wishlist", addToWishList);
router.get("/wishlist/:userId", getAllWishList);
router.put("/remove_wishlist", removeFromWishList);


export default router;
