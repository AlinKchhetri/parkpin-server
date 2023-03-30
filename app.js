import express from 'express';
import User from './routers/User.js';
import ParkingSpace from './routers/ParkingSpace.js'
import Booking from './routers/Booking.js';
import Payment from './routers/Payment.js';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import * as schedule from 'node-schedule'

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    useTempFiles: true
}));
app.use(cors());

app.use("/api/v1", User);
app.use("/api/v1", ParkingSpace);
app.use("/api/v1", Booking);
app.use("/api/v1", Payment);

app.get("/", (req, res) => {
    res.send('server running');
})

