import mongoose from "mongoose";

const bookingsSchema = new mongoose.Schema({
    userDetails: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    ownerDetails: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    parkingSpaceDetails: {
        type: mongoose.Schema.Types.ObjectId, ref: 'ParkingSpace'
    },
    slot_no: {
        type: Number,
    },
    booking_startTime: {
        type: Date,
        default: Date.now
    },
    booking_endTime: {
        type: Date,
        default: Date.now,
    },
    booking_extendedTime: {
        type: Date,
        default: Date.now,
    },
    bookedAt: {
        type: Date,
        default: Date.now,
    },
    response: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected', 'Canceled'],
        default: 'Pending'
    },
    status: {
        type: String,
        enum: ['Paid', 'Unpaid'],
        default: 'Unpaid'
    },
    vehicleType: {
        type: String,
        enum: ['bike', 'car'],
        default: 'bike'
    },
    duration: {
        type: Number,
        required: true,
        default: 0
    },
    total_fee: {
        type: Number,
        default: 0,
    }
});

export const Bookings = mongoose.model("Booking", bookingsSchema);