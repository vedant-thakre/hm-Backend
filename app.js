import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/db.js";
import userRoutes from "./routes/userRoutes.js";
import Address from "./models/addressModel.js";
import User from "./models/userModel.js";
import Otp from "./models/otpModel.js";
import cookieParser from "cookie-parser";

dotenv.config;
export const app = express();
connectDB();

// middleware
app.use(express.json());
app.use(cookieParser());


// Routes
app.use("/api/v1", userRoutes);

app.get("/", (req, res) => {
  res.send("Server is Live");
});
