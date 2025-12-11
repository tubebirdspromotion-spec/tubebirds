import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  createRazorpayOrder,
  verifyPayment,
  handleWebhook,
  getPaymentDetails,
  getPaymentHistory,
  refundPayment
} from '../controllers/paymentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Payment-specific rate limiting
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 orders per 15 minutes per IP
  message: 'Too many payment attempts from this IP. Please try again after 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Webhook route (no auth, verified by signature)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Protected routes
router.use(protect);

router.post('/create-order', paymentLimiter, createRazorpayOrder);
router.post('/verify', verifyPayment);
router.get('/history', getPaymentHistory);
router.get('/:paymentId', authorize('admin'), getPaymentDetails);
router.post('/refund', authorize('admin'), refundPayment);

export default router;
