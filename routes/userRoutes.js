import express from 'express';
import { registerUser } from '../controllers/userController.js';
import { veriftySecurityToken } from '../config/configfunctions.js';

const router = express.Router();

router.post("/register", registerUser);
router.get("/verify-email/:token", veriftySecurityToken);

export default router;