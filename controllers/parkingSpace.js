import { ParkingSpace } from "../models/parkingSpace.js";
import cloudinary from 'cloudinary';
import fs from 'fs'
// import axios from "axios";

export const addNewSpace = async (req, res) => {
    try {
        const { ownerId, locationName, four_wheeler_no_slot, two_wheeler_no_slot, four_wheeler_rate, two_wheeler_rate, latitude, longitude } = req.body;
        const image = req.files.image.tempFilePath;
        const thumbnailImage = req.files.thumbnailImage.tempFilePath;

        const imageCloud = await cloudinary.v2.uploader.upload(image, {
            folder: 'parking-Space',
        });

        const thumbnailImageCloud = await cloudinary.v2.uploader.upload(thumbnailImage, {
            folder: 'parking-Space',
        });

        fs.rmSync("./tmp", { recursive: true });

        let parkingSpaceDetails = await ParkingSpace.create({
            ownerDetails: ownerId,
            four_wheeler: {
                no_slot: four_wheeler_no_slot,
                rate: four_wheeler_rate
            },
            two_wheeler: {
                no_slot: two_wheeler_no_slot,
                rate: two_wheeler_rate
            },
            thumbnailImage: {
                public_id: thumbnailImageCloud.public_id,
                url: thumbnailImageCloud.secure_url
            },
            image: {
                public_id: imageCloud.public_id,
                url: imageCloud.secure_url
            },
            location: {
                type: "Point",
                coordinates: [parseFloat(longitude), parseFloat(latitude)]
            },
            locationName: locationName
        });

        res.status(200).json({
            success: true,
            message: 'New Parking Space added successfully',
            parkingSpace: parkingSpaceDetails
        })


    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getMyParking = async (req, res) => {
    try {
        const parkingSpaceDetails = await ParkingSpace.find({ 'ownerDetails': req.params.id }).populate('ownerDetails')

        res.status(200).json({
            success: true,
            message: 'Details retrieved successfully',
            parkingSpaceDetails: parkingSpaceDetails
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getParkingDetails = async (req, res) => {
    try {
        const parkingSpaceDetails = await ParkingSpace.findById(req.params.id).populate("ownerDetails");

        res.status(200).json({
            success: true,
            message: 'Details retrieved successfully',
            parkingSpaceDetails: parkingSpaceDetails
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getAllParking = async (req, res) => {
    try {
        const parkingSpaceDetails = await ParkingSpace.find({
            $or: [
                { "four_wheeler.no_slot": { $gt: 0 } },
                { "two_wheeler.no_slot": { $gt: 0 } }
            ]
        }).populate('ownerDetails');

        res.status(200).json({
            success: true,
            message: 'Details retrieved successfully',
            parkingSpaceDetails: parkingSpaceDetails,
            count: parkingSpaceDetails.length
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const deleteParking = async (req, res) => {
    try {
        const parkingSpaceDetails = await ParkingSpace.deleteOne({ _id: req.params.id })

        res.status(200).json({
            success: true,
            message: 'Parking Space deleted successfully'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getNearParking = async (req, res) => {
    try {
        const { latitude, longitude } = req.body;

        const parkingSpaceDetails = await ParkingSpace.aggregate([
            {
                $geoNear: {
                    near: {
                        type: "Point",
                        coordinates: [parseFloat(longitude), parseFloat(latitude)]
                    },
                    key: "location",
                    maxDistance: 1000,
                    distanceField: "dist.calculatedDistance",
                    spherical: true
                },
            }
        ]);

        res.status(200).json({
            success: true,
            message: 'Details retrieved successfully',
            parkingSpaceDetails: parkingSpaceDetails
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateSlots = async (req, res) => {
    try {
        const parkingSpace = await ParkingSpace.findById(req.params.id);

        const { two_wheeler_slot, four_wheeler_slot } = req.body;
        if (two_wheeler_slot) parkingSpace.two_wheeler.no_slot = two_wheeler_slot;
        if (four_wheeler_slot) parkingSpace.four_wheeler.no_slot = four_wheeler_slot;
        await parkingSpace.save();

        res.status(200).json({
            success: true,
            message: "Parking Space Slots updated successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

