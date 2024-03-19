import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './db/db.js';

dotenv.config;
export const app = express();
connectDB();

app.get("/", (req, res) => {
    res.send("Server is Live");
}) 

