import express from 'express';
import rateLimit from 'express-rate-limit';
import { 
  register, 
  login, 
  getMe, 
  updateProfile,
  updatePassword,
  forgotPassword,
  resetPassword,
  verify2FA,
  enable2FA,
  disable2FA,
  regenerateBackupCodes,
  get2FAStatus
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Rate limiter for registration - 3 accounts per hour per IP
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: 'Too many accounts created from this IP. Please try again after an hour.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for login - 5 attempts per 15 minutes per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: 'Too many login attempts. Please try again after 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for forgot password - 2 requests per day per IP
const forgotPasswordLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 2, // 2 requests per day
  message: 'Too many password reset requests. Please try again tomorrow.',
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', registerLimiter, register);
router.post('/login', loginLimiter, login);
router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfile);
router.put('/update-password', protect, updatePassword);

// 2FA routes
router.post('/verify-2fa', loginLimiter, verify2FA);
router.post('/enable-2fa', protect, enable2FA);
router.post('/disable-2fa', protect, disable2FA);
router.post('/regenerate-backup-codes', protect, regenerateBackupCodes);
router.get('/2fa-status', protect, get2FAStatus);

// Password reset routes with rate limiting
router.post('/forgot-password', forgotPasswordLimiter, forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router;
