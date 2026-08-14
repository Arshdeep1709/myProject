import { userModel } from '../models/usermodel.js';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export const userMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized please, login again"
            });
        }
        const decoded = jwt.verify(token, config.JWT_SECRET);
        if (decoded.id) {
            req.userID = decoded.id
        } else {
            return res.status(401).json({
                success: false,
                message: "Not authorized please, login again"
            });
        }
        next();
    } catch (error) {
        console.error("Invalid token:", error);
        return res.status(401).json({
            success: false,
            message: "Invalid token",
            error: error.message
        });
    }
};