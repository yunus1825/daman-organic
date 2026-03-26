import express from "express";
import {
  createAddress,
  getAllAddress,
  getAddressById,
  updateAddressById,
  deleteAddressById,
} from "../controllers/Address.controller.js"


const router = express.Router();
router.post("/myaddress/:userId", createAddress);
router.get("/myaddresslist/:userId", getAllAddress);
router.get("/myaddress/:AddressId", getAddressById);
router.put("/myaddress/:AddressId", updateAddressById);
router.delete("/myaddress/:AddressId", deleteAddressById);


export default router;
