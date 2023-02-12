import { app } from "./app.js";
import { config } from "dotenv";
import {connectDatabase} from './config/database.js';
import cloudinary from "cloudinary";
import * as schedule from 'node-schedule';
import { sendNotification } from "./utils/sendNotification.js";

config({
    path: "./config/config.env"
});

console.log(new Date())
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

connectDatabase();

app.listen(process.env.PORT || 4000, () => {
    console.log("Server is running on: " + process.env.PORT);
});