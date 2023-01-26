import { ParkingSpace } from "../models/parkingSpace.js";
import cloudinary from 'cloudinary';
import fs from 'fs'
// import axios from "axios";

export const addNewSpace = async (req, res) => {
    try {
        const { ownerId, four_wheeler_no_slot, two_wheeler_no_slot, four_wheeler_rate, two_wheeler_rate, latitude, longitude } = req.body;
        const image = req.files.image.tempFilePath;
        const thumbnailImage = req.files.thumbnailImage.tempFilePath;

        const imageCloud = await cloudinary.v2.uploader.upload(image, {
            folder: 'parking-Space',
        });

        const thumbnailImageCloud = await cloudinary.v2.uploader.upload(thumbnailImage, {
            folder: 'parking-Space',
        });

        fs.rmSync("./tmp", { recursive: true });


        // await axios.get(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`)
        //     .then((response) =>  {
        //         console.log("🚀 ~ file: parkingSpace.js:25 ~ .then ~ result", response.data.display_name)
        //     })
        //     .catch((error) => console.log(error));


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
                latitude,
                longitude,
            },
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



