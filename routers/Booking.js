import express from "express";
import { book, getMyBooking, respond, getMyBookingRequests, payment, getAllBooking } from "../controllers/Booking.js";

const router = express.Router();

router.route("/newbooking").post(book);
router.route("/getbooking/:id").get(getMyBooking);
router.route("/allbooking").get(getAllBooking);
router.route("/getrequests/:id").get(getMyBookingRequests);
router.route("/respond/:id").put(respond);
router.route("/payment").post(payment);


export default router;