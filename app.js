import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './db/db.js';
import userRoutes from './routes/userRoutes.js'

dotenv.config;
export const app = express();
connectDB();

// middleware
app.use(express.json());


// Routes
app.use("/api/v1", userRoutes)

app.get("/", (req, res) => {
    res.send("Server is Live");
}) 

