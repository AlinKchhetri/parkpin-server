import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phoneNumber: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: [8, "Password must be atleast 8 charachters long"],
        select: false
    },
    avatar: {
        public_id: String,
        url: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    expo_token: {
        type: String,
    },
    tasks: [{
        title: "String",
        description: "String",
        completed: Boolean,
        createdAt: Date,
    }],
    verified: {
        type: Boolean,
        default: false,
    },
    otp: Number,
    otp_expiry: Date,
    resetPasswordOtp: Number,
    resetPasswordOtpExpiry: Date,
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

userSchema.methods.getJWTToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_COOKIE_EXPIRY * 24 * 60 * 60 * 1000,
    })
};

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.index({ otp_expiry: 0 }, { expireAfterSeconds: 0 });

export const User = mongoose.model("User", userSchema);