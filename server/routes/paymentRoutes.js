import express from 'express';
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

// Webhook route (no auth, verified by signature)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Protected routes
router.use(protect);

router.post('/create-order', createRazorpayOrder);
router.post('/verify', verifyPayment);
router.get('/history', getPaymentHistory);
router.get('/:paymentId', authorize('admin'), getPaymentDetails);
router.post('/refund', authorize('admin'), refundPayment);

export default router;
