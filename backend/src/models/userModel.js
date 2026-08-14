import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: [true, "Username must be unique"],
        sparse: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email must be unique"],
        match: [
            /^[a-z0-9._%+-]+@[a-z0-9-]+\.[a-z]{2,63}$/,
            "Please enter a valid email address"
        ]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"]
    },
    verifyOtp: {
        type: String,
        default: ''
    },
    otpExpiresIn: {
        type: Number,
        default: 0
    },
    resetOtp: {
        type: String,
        default: ''
    },
    resetOtpExpiresIn: {
        type: Number,
        default: 0
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export const userModel = mongoose.models.User || mongoose.model("User", userSchema);