import express from "express";
import {
  createCategories,
  getAllCategories,
  updateCategoryById,
  getCategoryById,
  deleteCategoryById,
  CategoryOrderUpdate,
  getAdminCategories,
  updateCategoryStatus,
} from "../controllers/Categories.controller.js";

const router = express.Router();

router.post("/category_add", createCategories);
router.get("/category_list", getAllCategories);
router.get("/category_list_admin", getAdminCategories);
router.put("/category_status_update/:CategoryId", updateCategoryStatus);
router.get("/category/:CategoryId", getCategoryById);
router.delete("/category_del/:CategoryId", deleteCategoryById);
router.put("/category_update/:CategoryId", updateCategoryById);
router.put("/categories_updateorder", CategoryOrderUpdate);

export default router;
