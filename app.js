import express from 'express';
import dotenv from 'dotenv';

dotenv.config;
export const app = express();

app.get("/", (req, res) => {
    res.send("Server is Live");
}) 

