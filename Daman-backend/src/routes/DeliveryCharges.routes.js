import express from "express";
import {
  createDeliveryCharges,
  getAllDeliveryChargess,
  getDeliveryChargesById,
  updateDeliveryChargesById,
  deleteDeliveryChargesById,
} from "../controllers/DeliveryCharges.controller.js";

const Pincoderouter = express.Router();

// Create a new Pincode
Pincoderouter.post("/charges_add", createDeliveryCharges);
Pincoderouter.get("/charges_list", getAllDeliveryChargess);
Pincoderouter.get("/charges/:DeliveryChargesById", getDeliveryChargesById);
Pincoderouter.put("/charges_upd/:DeliveryChargesById", updateDeliveryChargesById);
Pincoderouter.delete("/charges_del/:DeliveryChargesById", deleteDeliveryChargesById);




export default Pincoderouter;
