import express from "express";
import {
    createAdminUser,
    getAllAdminUser,
    getAdminUserById,
    deleteAdminUserById,
    updateAdminUserById,
    AdminloginUser,
} from "../controllers/AdminUser.controller.js";

const router = express.Router();

router.post("/adminuser", createAdminUser);
router.get("/adminuser", getAllAdminUser);
router.get("/adminuser/:AdminUserId", getAdminUserById);
router.delete("/adminuser/:AdminUserId", deleteAdminUserById);
router.put("/adminuser/:AdminUserId", updateAdminUserById);
router.post("/adminuserlogin", AdminloginUser);



export default router;


