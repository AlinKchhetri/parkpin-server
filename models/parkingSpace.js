import mongoose from "mongoose";

const parkingSpaceSchema = new mongoose.Schema({
    ownerDetails: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true
    },
    location:
    {
        type: { type: String, required: true },
        coordinates: []
    },
    locationName: {
        type: String,
        required: true
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

parkingSpaceSchema.index({ location: "2dsphere" });

export const ParkingSpace = mongoose.model("ParkingSpace", parkingSpaceSchema);