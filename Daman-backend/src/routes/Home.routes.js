import express from "express";
import {
  createHomes,
  updateHomesById,
  getHomeById,
  deleteHomeById,
  getAllHomeSections,
} from "../controllers/Home.controller.js";


const router = express.Router();
router.post("/home_section_add", createHomes);
router.put("/home_section_upd/:HomeId", updateHomesById);
router.get("/home_section_detail/:HomeId", getHomeById);
router.delete("/home_section_del/:HomeId", deleteHomeById);
router.get("/home_section_list", getAllHomeSections);



export default router;
