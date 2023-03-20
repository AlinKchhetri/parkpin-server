import { Bookings } from "../models/bookings.js";
import { ParkingSpace } from "../models/parkingSpace.js";
import { sendNotification } from "../utils/sendNotification.js";
import { scheduleJob } from "node-schedule";

export const book = async (req, res) => {
    try {
        const { userId, ownerId, parkingSpaceId, startTime, endTime, vehicleType, fee } = req.body;

        let bookingDetails = await Bookings.create({
            userDetails: userId,
            ownerDetails: ownerId,
            parkingSpaceDetails: parkingSpaceId,
            bookedAt: startTime,
            booking_endTime: endTime,
            vehicleType: vehicleType,
            total_fee: fee
        });

        const errorMessage = await sendNotification('ExponentPushToken[vH6sIsOQzZwrqGO0JYipXQ]', 'ParkPin 📬', `You have a reservation request for your parking space `);

        res.status(200).json({
            success: true,
            message: 'Booking completed successfully',
            booking: bookingDetails,
            error: errorMessage
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

export const getMyBookingRequests = async (req, res) => {
    try {
        const bookingDetails = await Bookings.find({ 'ownerDetails': req.params.id }).populate('userDetails').populate('ownerDetails').populate('parkingSpaceDetails');

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

        const parkingSpace = await ParkingSpace.findById(bookings.parkingSpaceDetails);
        console.log("🚀 ~ file: Booking.js:57 ~ respond ~ parkingSpace:", parkingSpace)

        const { response } = req.body;
        if (response) bookings.response = response;
        await bookings.save();

        if (parkingSpace) {
            if (bookings.vehicleType === 'bike') {
                parkingSpace.two_wheeler.no_slot = --parkingSpace.two_wheeler.no_slot;
            } else {
                parkingSpace.four_wheeler.no_slot = --parkingSpace.four_wheeler.no_slot;
            }
            await parkingSpace.save();
        }

        const notificationResponse = response.toLowerCase()
        const errorMessage = await sendNotification('ExponentPushToken[vH6sIsOQzZwrqGO0JYipXQ]', 'ParkPin 📬', `Your reservation request has been ${notificationResponse} ${notificationResponse == 'rejected' ? '❌' : '✅'} `);
        console.log("🚀 ~ file: Booking.js:55 ~ respond ~ errorMessage")
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