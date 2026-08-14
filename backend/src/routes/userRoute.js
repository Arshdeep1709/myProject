import express from 'express';
import { signup, login, logout, sendOtp, verifyOtp, sendResetOtp, resetPassword, isAuthenticated, getUserProfile } from '../controllers/userController.js';
import { userMiddleware } from '../middleware/userMiddleware.js';

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post('/send-otp', userMiddleware, sendOtp);
router.post('/verify-account', userMiddleware, verifyOtp);
router.get('/is-authenticated', userMiddleware, isAuthenticated);
router.post('/send-reset-otp', sendResetOtp);
router.post('/reset-password', resetPassword);
router.get('/profile', userMiddleware, getUserProfile);

export default router;