import express from "express";
import app from './app';
import "./routes/middleware/passport";
import { initializeConnectionBdd } from './database/initdb';

require('dotenv').config();
const port = process.env.SERVER_PORT;

app.listen(port, () =>
 {
   console.log(`Server started at http://localhost:${port}`);
   initializeConnectionBdd();
 });
