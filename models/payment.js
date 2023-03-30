import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    userDetails: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    ownerDetails: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    bookingDetails: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Bookings',
        required: true
    },
    parkingSpaceDetails: {
        type: mongoose.Schema.Types.ObjectId, ref: 'ParkingSpace',
        required: true
    },
    payment_fee: {
        type: Number,
        required: true
    },
    commission_fee: {
        type: Number,
        required: true
    },
    paymentAt: {
        type: Date,
        default: Date.now,
    }
});

export const Payment = mongoose.model("Payment", paymentSchema);