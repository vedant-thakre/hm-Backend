import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/db.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import cookieParser from "cookie-parser";
import { createRelations } from "./models/index.js";

dotenv.config;
export const app = express();
connectDB();
createRelations();

// middleware
app.use(express.json());
app.use(cookieParser());


// Routes
app.use("/api/v1", userRoutes);
app.use("/admin/api/v1/admin-dashboard", adminRoutes);
app.use("/superadmin/api/v1/admin-dashboard/request", requestRoutes);

app.get("/", (req, res) => {
  res.send("Server is Live");
});
