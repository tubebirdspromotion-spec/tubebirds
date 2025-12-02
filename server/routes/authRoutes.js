import express from 'express';
import rateLimit from 'express-rate-limit';
import { 
  register, 
  login, 
  getMe, 
  updateProfile,
  updatePassword,
  forgotPassword,
  resetPassword
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Rate limiter for forgot password - 2 requests per day per IP
const forgotPasswordLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 2, // 2 requests per day
  message: 'Too many password reset requests. Please try again tomorrow.',
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfile);
router.put('/update-password', protect, updatePassword);

// Password reset routes with rate limiting
router.post('/forgot-password', forgotPasswordLimiter, forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router;
