import express from 'express';
import { forgotPassword, forgotPasswordEmailLink, forgotPasswordVerifyAndChangePassword, loginUser, matchOtp, registerUser } from '../controllers/userController.js';
import { verifySecurityToken } from "../config/configfunctions.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/user/forgot-password", forgotPassword);
router.post("/user/forgot-password2", forgotPasswordEmailLink);
router.post("/user/forgot-password/match-otp", matchOtp);
router.post("/user/forgot-password/change_password_using_email/link/:token", forgotPasswordVerifyAndChangePassword);
router.get("/verify-email/:token", verifySecurityToken);


export default router;