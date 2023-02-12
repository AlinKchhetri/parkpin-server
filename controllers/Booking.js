import { Bookings } from "../models/bookings.js";
import { ParkingSpace } from "../models/parkingSpace.js";
import { sendNotification } from "../utils/sendNotification.js";
import { scheduleJob } from "node-schedule";

export const book = async (req, res) => {
    try {
        const { userId, ownerId, parkingSpaceId } = req.body;

        let bookingDetails = await Bookings.create({
            userDetails: userId,
            ownerDetails: ownerId,
            parkingSpaceDetails: parkingSpaceId
        });

        res.status(200).json({
            success: true,
            message: 'Booking completed successfully',
            booking: bookingDetails
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getMyBooking = async (req, res) => {
    try {
        const bookingDetails = await Bookings.find({ 'userDetails': req.params.id }).populate('userDetails').populate('ownerDetails').populate('parkingSpaceDetails');

        res.status(200).json({
            success: true,
            message: 'Details retrieved successfully',
            bookingDetails: bookingDetails
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const respond = async (req, res) => {
    try {

        const bookings = await Bookings.findById(req.params.id);
        
        const { response } = req.body;
        if (response) bookings.response = response;
        await bookings.save();
        
        const errorMessage= await sendNotification('ExponentPushToken[vH6sIsOQzZwrqGO0JYipXQ]', 'Booking Response', 'Body for Booking response');
        console.log("🚀 ~ file: Booking.js:55 ~ respond ~ errorMessage", errorMessage)
        res.status(200).json({
            success: true,
            message: "Booking response submitted successfully",
            error: errorMessage
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};