import { Bookings } from "../models/bookings.js";
import { Payment } from "../models/payment.js";

export const newPayment = async (req, res) => {
    try {
        const { userId, ownerId, bookingId, parkingSpaceId, fee, commission } = req.body;

        paymentDetails = await Payment.create({
            userDetails: userId,
            ownerDetails: ownerId,
            bookingDetails: bookingId,
            parkingSpaceDetails: parkingSpaceId,
            payment_fee: fee,
            commission_fee: commission
        });

        res.status(200).json({
            success: true,
            message: 'Payment Successful'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getSalesByMonth = async (req, res) => {
    try {
        const paymentDetails = await Payment.aggregate([
            {
                $group: {
                    _id: { $substrCP: ["$paymentAt", 0, 7] },
                    total_sales: { $sum: "$payment_fee" }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        res.status(200).json({
            success: true,
            message: 'Details retrieved successfully',
            salesDetails: paymentDetails
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getEarningsByMonth = async (req, res) => {
    try {
        const paymentDetails = await Payment.aggregate([
            {
                $group: {
                    _id: { $substrCP: ["$paymentAt", 0, 7] },
                    total_sales: { $sum: "$commission_fee" }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        res.status(200).json({
            success: true,
            message: 'Details retrieved successfully',
            commissionDetails: paymentDetails
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getTotalSales = async (req, res) => {
    try {
        const paymentDetails = await Payment.aggregate([
            {
                $group: {
                    _id: null,
                    total_sales: { $sum: "$payment_fee" }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            message: 'Details retrieved successfully',
            totalSales: paymentDetails
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getMyTotalSales = async (req, res) => {
    try {

        const paymentDetails = await Payment.aggregate([
            {
                $match: { "ownerDetails": req.params.id }
            },
            {
                $group: {
                    _id: null,
                    total_sales: { $sum: "$payment_fee" }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            message: 'Details retrieved successfully',
            totalSales: paymentDetails
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getTotalEarnings = async (req, res) => {
    try {
        const paymentDetails = await Payment.aggregate([
            {
                $group: {
                    _id: null,
                    total_earnings: { $sum: "$commission_fee" }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            message: 'Details retrieved successfully',
            totalEarnings: paymentDetails
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
