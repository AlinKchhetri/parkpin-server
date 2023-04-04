import express from "express";
import { getEarningsByMonth, getMyTotalSales, getSalesByMonth, getTotalEarnings, getTotalSales, newPayment } from "../controllers/Payment.js";

const router = express.Router();

router.route("/newpayment").post(newPayment);
router.route("/monthlysales").get(getSalesByMonth);
router.route("/monthlyearnings").get(getEarningsByMonth);
router.route("/totalsales").get(getTotalSales);
router.route("/mytotalsales/:id").get(getMyTotalSales);
router.route("/totalearnings").get(getTotalEarnings);

export default router;