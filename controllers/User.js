import { User } from '../models/users.js';
import { sendMail } from '../utils/sendMail.js'
import { sendToken } from '../utils/sendToken.js'
import cloudinary from 'cloudinary'
import fs from 'fs'


export const register = async (req, res) => {
    try {
        const { name, email, password, phoneNumber } = req.body;

        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                success: false,
                message: 'User already registered'
            });
        }

        const otp = Math.floor(Math.random() * 1000000);

        const otp_expiry = new Date(Date.now() + process.env.OTP_EXPIRY * 60 * 1000);


        user = await User.create({
            name,
            email,
            password,
            phoneNumber,
            otp,
            otp_expiry,
        });

        await sendMail(email, "Verify your account", `OTP : ${otp}`);

        sendToken(res, user, 201, "OTP sent successfully");

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email address'
            });
        }

        const otp = Math.floor(Math.random() * 1000000);

        user.otp = otp;
        user.otp_expiry = Date.now() + 10 * 60 * 1000;

        await user.save();

        await sendMail(email, "Verify your account", `OTP : ${otp}`);

        res.status(200).json({
            success: true,
            message: `OTP sent to ${email}`
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export const googleAuthRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                success: false,
                message: 'User already registered'
            });
        }

        user = await User.create({
            name,
            email,
            password,
            verified: true,
        });

        sendToken(res, user, 201, "OTP sent successfully");

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const verify = async (req, res) => {
    try {
        const otp = Number(req.body.otp);

        const user = await User.findById(req.user._id);

        if (user.otp !== otp || user.otp_expiry < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "Invalid otp or has been expired"
            })
        }

        user.verified = true;
        user.otp = null;
        user.otp_expiry = null;

        await user.save();
        sendToken(res, user, 200, "Account Verified");
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter email or password"
            })
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        sendToken(res, user, 200, "Loggedin successfully");
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const logout = async (req, res) => {
    try {
        res.status(200).cookie("token", null, {
            expires: new Date(Date.now()),
        }).json({
            success: true,
            message: 'Logout successfully'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const addTask = async (req, res) => {
    try {
        const { title, description } = req.body;

        const user = await User.findById(req.user.id);

        user.tasks.push({
            title,
            description,
            completed: false,
            createdAt: new Date(Date.now())
        });

        await user.save();
        res.status(200).json({
            success: true,
            message: 'Task added successfully'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export const removeTask = async (req, res) => {
    try {
        const { taskId } = req.params;

        const user = await User.findById(req.user.id);

        user.tasks = user.tasks.filter((task) => task._id.toString() !== taskId.toString());

        await user.save();
        res.status(200).json({
            success: true,
            message: 'Task removed successfully'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const completeTask = async (req, res) => {
    try {
        const { taskId } = req.params;

        const user = await User.findById(req.user._id);

        user.task = user.tasks.find((task) => task._id.toString() === taskId.toString());

        user.task.completed = !user.task.completed;
        await user.save();
        res.status(200).json({
            success: true,
            message: 'Task completed successfully'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getMyProfile = async (req, res) => {
    try {

        const user = await User.findById(req.user._id);

        sendToken(res, user, 201, `Welcome Back ${user.name}`);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export const getUserDetails = async (req, res) => {
    try {
        const userDetails = await User.findById(req.params.id);

        res.status(200).json({
            success: true,
            message: 'User details retrieved successfully',
            userDetails: userDetails
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateProfile = async (req, res) => {
    try {

        const user = await User.findById(req.user._id);

        const { name } = req.body;
        const avatar = req.files.avatar.tempFilePath;

        if (name) user.name = name;
        if (avatar) {
            await cloudinary.v2.uploader.destroy(user.avatar.public_id);

            const mycloud = await cloudinary.uploader.upload(avatar);
            fs.rmSync("./tmp", { recursive: true });
            user.avatar = {
                public_id: mycloud.public_id,
                url: mycloud.secure_url,
            }
        }
        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const updatePassword = async (req, res) => {
    try {

        const user = await User.findById(req.user._id).select("+password");

        const { oldPassword, newPassword } = req.body;


        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Please enter all fields"
            })
        }

        const isMatch = await user.comparePassword(oldPassword);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid Old password"
            })
        }

        user.password = newPassword;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password updated successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
export const registerToken = async (req, res) => {
    try {

        const user = await User.findById(req.user._id);

        const { token } = req.body;

        user.expo_token = token;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Token registered successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const forgotPassword = async (req, res) => {
    try {

        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email"
            })
        }

        const otp = Math.floor(Math.random() * 1000000);

        user.resetPasswordOtp = otp;
        user.resetPasswordOtpExpiry = Date.now() + 10 * 60 * 1000;

        await user.save();

        await sendMail(email, "Verify your account for password reset", `OTP : ${otp}`);

        res.status(200).json({
            success: true,
            message: `OTP sent to ${email}`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const resetPassword = async (req, res) => {
    try {

        const { otp, newPassword } = req.body;


        const user = await User.findOne({ resetPasswordOtp: otp, resetPasswordOtpExpiry: { $gt: Date.now() } }).select("+password");

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid otp or expired"
            })
        }

        user.password = newPassword;
        user.resetPasswordOtp = null;
        user.resetPasswordOtpExpiry = null;

        await user.save();

        res.status(200).json({
            success: true,
            message: `Password reset successfully`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};