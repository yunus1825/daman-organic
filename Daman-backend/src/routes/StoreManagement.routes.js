import express from "express";
import {
  createStoreManagement,
  getAllStoreManagements,
  getStoreManagementById,
  updateStoreManagementById,
  deleteStoreManagementById,
} from "../controllers/StoreManagement.controller.js";

const Pincoderouter = express.Router();

// Create a new Pincode
Pincoderouter.post("/store_add", createStoreManagement);
Pincoderouter.get("/store_list", getAllStoreManagements);
Pincoderouter.get("/store_details/:StoreManagementById", getStoreManagementById);
Pincoderouter.put("/store_upd/:StoreManagementById", updateStoreManagementById);
Pincoderouter.delete("/store_del/:StoreManagementById", deleteStoreManagementById);




export default Pincoderouter;
