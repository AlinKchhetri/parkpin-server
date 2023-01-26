import  express from "express";
import { addNewSpace, getMyParking } from "../controllers/parkingSpace.js";

const router = express.Router();

router.route("/new").post(addNewSpace);
router .route("/myparking/:id").get(getMyParking);


export default router;