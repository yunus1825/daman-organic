import express from "express";
import {
  createProducts,
  getAllProducts,
  searchProducts,
  getProductsById,
  updateProductsById,
  deleteProductsById,
  ProductsByCategory,
  getAllProductsdrpdown,
  ProductRatingUpdate,
  ProductReviewUpdate,
  PrdHideandunHide,
  ProductsOrderUpdate,
  updateVariantStock,
} from "../controllers/Products.controller.js";
import { upload } from "../middleware/upload.js";
import {
  bulkUploadProducts,
  downloadTemplate,
} from "../controllers/productsBulk.controller.js";

const router = express.Router();

router.post("/product_add", createProducts);
router.get("/product_list", getAllProducts);
router.get("/product_search", searchProducts);
router.get("/product_details/:ProductId", getProductsById);
router.put("/product_upd/:ProductId", updateProductsById);
router.delete("/product_del/:ProductId", deleteProductsById);
router.get("/products_by_category/:CategoryId", ProductsByCategory);
router.get("/product_drpdown_list", getAllProductsdrpdown);
router.put("/productRating/:ProductId", ProductRatingUpdate);
router.put("/productReview/:ProductId", ProductReviewUpdate);
router.put("/prd_hide/:ProductId", PrdHideandunHide);
router.put("/products_updateorder", ProductsOrderUpdate);
router.put("/:productId/variant/:variantIndex/stock", updateVariantStock);

// bulk upload products
// Bulk upload products
router.post("/products/bulk-upload", upload.single("file"), bulkUploadProducts);
router.get("/products/bulk-upload-template", downloadTemplate);

export default router;
