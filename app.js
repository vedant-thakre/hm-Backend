import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/db.js";
import userRoutes from "./routes/userRoutes.js";
import Address from "./models/addressModel.js";
import User from "./models/userModel.js";
import Otp from "./models/otpModel.js";

dotenv.config;
export const app = express();
connectDB();

// Relation between Schemas
User.hasMany(Otp);
User.hasMany(Address);

Otp.belongsTo(User);

Address.belongsTo(User);

// middleware
app.use(express.json());

// Routes
app.use("/api/v1", userRoutes);

app.get("/", (req, res) => {
  res.send("Server is Live");
});
