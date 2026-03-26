import { Router } from "express";
import {
  UserSignup,
  loginwithEmail,
  updateUserById,
  getAllUsers,
  getUserById,
  GenerateOtp,
  Login,
  updatepasswordById,
  UpdateProfile,
} from "../controllers/user.controller.js";

const router = Router();
router.post("/user_register", UserSignup);
router.post("/login_with_email", loginwithEmail);
router.post("/send_otp", GenerateOtp);
router.post("/verifylogin", Login);
router.post("/update-profile", UpdateProfile);
router.put("/update_user/:UserId", updateUserById);
router.get("/userlist/", getAllUsers);
router.get("/user_details/:UserId", getUserById);
router.put("/password_upd/:UserId", updatepasswordById);

export default router;
