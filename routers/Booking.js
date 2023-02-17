import  express from "express";
import { book, getMyBooking, respond} from "../controllers/Booking.js";

const router = express.Router();

router.route("/newbooking").post(book);
router.route("/getbooking/:id").get(getMyBooking);
router.route("/respond/:id").put(respond);


export default router;