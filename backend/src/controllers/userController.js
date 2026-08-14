import { userModel } from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { verifyEmail } from "../config/nodemailer.js";
import { sendOtpEmail } from "../config/nodemailer.js";
import { resetOtpEmail } from "../config/nodemailer.js";
import { userMiddleware } from "../middleware/userMiddleware.js";

export const signup = async (req, res) => {
    console.log("req.body:", req.body);
    try {
        const { name, email, password } = req.body;
        // if (!firstName || !lastName || !userName || !email || !password) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "First name, last name, username, email, and password are required"
        //     });
        // }
        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Name required!"
            });
        }
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email required!"
            });
        }
        if (!password) {
            return res.status(400).json({
                success: false,
                message: "password required!"
            });
        }
        const existingUser = await userModel.findOne({
            $or: [
                { name: name },
                { email: email }
            ]
        });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User with this name or email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userModel.create({
            name: name,
            email: email,
            password: hashedPassword
        });

        const token = jwt.sign({
            id: newUser._id
        }, config.JWT_SECRET, { expiresIn: '7d' });

        res.cookie("token", token, {
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            sameSite: config.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        await verifyEmail(email, token, name);
        newUser.token = token;
        await newUser.save();

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            },
            token: token
        });
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create user",
            error: error.message
        });
    }
};
export const login = async (req, res) => {
    try {
        const { loginID, password } = req.body;
        if (!loginID) {
            return res.status(400).json({
                success: false,
                message: "Username/email are required"
            });
        }
        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Password required!"
            });
        }

        const findUser = await userModel.findOne({
            $or: [
                { name: loginID },
                { email: loginID }
            ]
        });
        if (!findUser) {
            return res.status(404).json({
                success: false,
                message: "Invalid Username/email"
            });
        }
        const isMatch = await bcrypt.compare(password, findUser.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }
        const token = jwt.sign({ id: findUser._id }, config.JWT_SECRET);

        res.cookie("token", token, {
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            sameSite: config.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                id: findUser._id,
                name: findUser.name,
                email: findUser.email
            },
            token
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred during login",
            error: error.message
        });
    }
};
export const logout = (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            sameSite: config.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        }
        )
        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred during logout",
            error: error.message
        });
    }
};
export const sendOtp = async (req, res) => {
    try {
        const userID = req.userID

        const user = await userModel.findById(userID)

        if (user.isVerified) {
            return res.status(401).json({
                success: false,
                message: 'Account already verified'
            });
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000))
        user.verifyOtp = otp
        user.otpExpiresIn = Date.now() + 24 * 60 * 60 * 1000

        await sendOtpEmail(user.email, otp, user.name);
        await user.save()

        return res.status(200).json({
            success: true,
            message: "Otp sent successfully"
        });

    } catch (error) {
        console.error("Otp sending error:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while sending Otp",
            error: error.message
        });
    }
};
export const verifyOtp = async (req, res) => {
    try {
        const { otp } = req.body
        const userID = req.userID

        if (!userID) {
            return res.status(401).json({
                success: false,
                message: "Missing ID"
            });
        }
        if (!otp) {
            return res.status(401).json({
                success: false,
                message: "Missing OTP"
            });
        }
        const user = await userModel.findById(userID)
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }
        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.status(401).json({
                success: false,
                message: "Invalid OTP"
            });
        }
        if (user.otpExpiresIn < Date.now()) {
            return res.status(401).json({
                success: false,
                message: "OTP expired"
            });
        }
        user.isVerified = true
        user.verifyOtp = ''
        user.otpExpiresIn = 0

        await user.save()
        return res.status(200).json({
            success: true,
            message: 'Email verified'
        })
    }
    catch (error) {
        console.error("Verification error:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred during verification",
            error: error.message
        });
    }
};
export const isAuthenticated = async (req, res) => {
    try {
        const userID = req.userID
        const user = await userModel.findById(userID)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "User is authenticated",
            userData: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred during authentication",
            error: error.message
        });
    }
};
export const sendResetOtp = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email required!"
            });
        }
        const user = await userModel.findOne({ email: email })
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000))
        user.resetOtp = otp
        user.resetOtpExpiresIn = Date.now() + 15 * 60 * 1000 // 15 minutes
        await resetOtpEmail(user.email, otp, user.name);
        await user.save()
        return res.status(200).json({
            success: true,
            message: "Reset Otp sent successfully"
        });
    }
    catch (error) {
        console.error("Reset Otp sending error:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while sending Reset Otp",
            error: error.message
        });
    }
};
export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body
        if (!email || !otp || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Email, OTP and new password are required"
            });
        }
        const user = await userModel.findOne({ email: email })
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        if (user.resetOtp === '' || user.resetOtp !== otp) {
            return res.status(401).json({
                success: false,
                message: "Invalid OTP"
            });
        }
        if (user.resetOtpExpiresIn < Date.now()) {
            return res.status(401).json({
                success: false,
                message: "OTP expired"
            });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword
        user.resetOtp = ''
        user.resetOtpExpiresIn = 0
        await user.save()
        return res.status(200).json({
            success: true,
            message: "Password reset successfully"
        });
    }
    catch (error) {
        console.error("Password reset error:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while resetting password",
            error: error.message
        });
    }
};
export const getUserProfile = async (req, res) => {
    try {
        const userID = req.userID
        const user = await userModel.findById(userID).select('-password -verifyOtp -resetOtp -otpExpiresIn -resetOtpExpiresIn');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        else {
            return res.status(200).json({
                success: true,
                message: "User profile fetched successfully",
                userData: {
                    isVerified: user.isVerified,
                    name: user.name,
                    email: user.email,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                }
            });
        }
    } catch (error) {
        console.error("Get user profile error:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching user profile",
            error: error.message
        });
    }
};
