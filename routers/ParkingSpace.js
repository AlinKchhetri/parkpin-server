import  express from "express";
import { addNewSpace, getAllParking, getMyParking, getNearParking, getParkingDetails } from "../controllers/parkingSpace.js";

const router = express.Router();

router.route("/new").post(addNewSpace);
router .route("/myparking/:id").get(getMyParking);
router .route("/parkingdetails/:id").get(getParkingDetails);
router .route("/allparking").get(getAllParking);
router .route("/nearparking").get(getNearParking);


export default router;