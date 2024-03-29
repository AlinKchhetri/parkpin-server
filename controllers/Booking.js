import { Bookings } from "../models/bookings.js";
import { User } from "../models/users.js";
import { ParkingSpace } from "../models/parkingSpace.js";
import { sendNotification } from "../utils/sendNotification.js";
import { scheduleJob } from "node-schedule";
import Stripe from "stripe";

const stripe = new Stripe('sk_test_51LesieK4lDTa5OSUJPmtPFpb5CnfETItKVqEC0DWG1ePoSWop2GTzbMND4HmfI2LjrxYSx1rMybyy5KsVAI8mLn800BuKNVYrP');

export const book = async (req, res) => {
    try {
        const { userId, ownerId, parkingSpaceId, startTime, endTime, vehicleType, hour, fee } = req.body;

        const ownerDetails = await User.findById(ownerId);
        const userDetails = await User.findById(userId);

        let bookingDetails = await Bookings.create({
            userDetails: userId,
            ownerDetails: ownerId,
            parkingSpaceDetails: parkingSpaceId,
            bookedAt: startTime,
            booking_endTime: endTime,
            vehicleType: vehicleType,
            duration: hour,
            total_fee: fee
        });

        if (ownerDetails?.expo_token) {
            const errorMessage = await sendNotification(ownerDetails?.expo_token, 'ParkPin 📬', `You have a reservation request for your parking space `);
        }

        if (userDetails?.expo_token) {
            const errorMessage = await sendNotification(userDetails?.expo_token, 'ParkPin 📬', `Your reservation request for parking space has been sent successfully`);
        }

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

export const getAllBooking = async (req, res) => {
    try {
        const bookingDetails = await Bookings.find({});

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
        const ownerBookingDetails = await Bookings.find({ 'ownerDetails': req.params.id }).populate('userDetails').populate('ownerDetails').populate('parkingSpaceDetails');
        const userBookingDetails = await Bookings.find({ 'userDetails': req.params.id }).populate('userDetails').populate('ownerDetails').populate('parkingSpaceDetails');

        const bookingDetails = ownerBookingDetails.concat(userBookingDetails).filter((obj, index, arr) => {
            return index === arr.findIndex(t => t._id === obj._id);
        })
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

        const userDetails = await User.findById(bookings.userDetails);

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

        const notificationResponse = response.toLowerCase();
        if (userDetails?.expo_token) {
            const errorMessage = await sendNotification(userDetails?.expo_token, 'ParkPin 📬', `Your reservation request has been ${notificationResponse} ${notificationResponse == 'rejected' ? '❌' : '✅'} `);
        }
        res.status(200).json({
            success: true,
            message: "Booking response submitted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const payment = async (req, res) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: req.body.amount,
            currency: 'npr',
            automatic_payment_methods: {
                enabled: true
            }
        });

        res.status(200).json({
            success: true,
            message: 'Secret retrieved successfully',
            paymentIntent: paymentIntent.client_secret
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};