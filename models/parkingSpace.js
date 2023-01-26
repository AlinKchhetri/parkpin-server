import mongoose from "mongoose";

const parkingSpaceSchema = new mongoose.Schema({
    ownerDetails: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true
    },
    location:
    {
        latitude: Number,
        longitude: Number,
    },
    thumbnailImage: {
        public_id: String,
        url: String
    },
    image: {
        public_id: String,
        url: String
    },
    four_wheeler: {
        no_slot: Number,
        rate: Number
    },
    two_wheeler: {
        no_slot: Number,
        rate: Number
    },
    publishedDate: {
        type: Date,
        default: Date.now,
    }
});

export const ParkingSpace = mongoose.model("ParkingSpace", parkingSpaceSchema);