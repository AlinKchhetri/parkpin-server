import express from "express";
import { getEarningsByMonth, getSalesByMonth, getTotalEarnings, getTotalSales, newPayment } from "../controllers/Payment.js";

const router = express.Router();

router.route("/payment").post(newPayment);
router.route("/monthlysales").get(getSalesByMonth);
router.route("/monthlyearnings").get(getEarningsByMonth);
router.route("/totalsales").get(getTotalSales);
router.route("/totalearnings").get(getTotalEarnings);

export default router;