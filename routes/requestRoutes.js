import express from "express";
import { SuperAdminAccess } from "../config/configfunctions.js";
import { AcceptRequest, getAllRequest } from "../controllers/requestController.js";

const router = express.Router();

router.put("/accept/:id", SuperAdminAccess, AcceptRequest);
router.get("/get-all-request", SuperAdminAccess, getAllRequest);

export default router;
