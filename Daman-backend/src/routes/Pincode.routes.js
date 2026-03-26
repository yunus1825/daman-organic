import express from "express";
import {
  createPincode,
  getAllPincodes,
  getPincodeById,
  updatePincodeById,
  deletePincodeById,
  updatePincodeStatusById,
  getAllActivePincodes,
} from "../controllers/Pincode.controller.js";

const Pincoderouter = express.Router();

// Create a new Pincode
Pincoderouter.post("/pincode_add", createPincode);
Pincoderouter.get("/pincode_list", getAllPincodes);
Pincoderouter.get("/pincodes/:PincodeById", getPincodeById);
Pincoderouter.put("/pincode_upd/:PincodeById", updatePincodeById);
Pincoderouter.delete("/pincodes_del/:PincodeByid", deletePincodeById);
Pincoderouter.put("/pincode_status_upd/:PincodeById", updatePincodeStatusById);
Pincoderouter.get("/pincode_active_list", getAllActivePincodes);



export default Pincoderouter;
