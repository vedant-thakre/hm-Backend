import express from "express";
import { createTask, createUser, getAllTask } from "../controllers/taskController.js";


const router = express.Router();

router.post("/create-user", createUser);
router.post("/create-task", createTask);
router.get("/get-all-task", getAllTask);

export default router;
