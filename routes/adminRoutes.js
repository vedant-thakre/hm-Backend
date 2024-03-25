import express from "express";
import { loginAdmin, registerAdmin } from "../controllers/adminController.js";
import { verifySecurityToken } from "../config/configfunctions.js";
import { forgotPassword, loginUser, matchOtp } from "../controllers/userController.js";


const router = express.Router();

router.post("/register", registerAdmin);
router.get("/verify-email/:token", verifySecurityToken);
router.post("/login", loginAdmin);
// router.post("/forgot-password", forgotPassword);
// router.post("/forgot-password/resend-otp", forgotPassword);
// router.post("/forgot-password/match-otp", matchOtp);



export default router;
