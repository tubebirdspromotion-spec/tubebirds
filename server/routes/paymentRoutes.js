import express from 'express';
import {
  createRazorpayOrder,
  verifyPayment,
  getPaymentDetails,
  refundPayment
} from '../controllers/paymentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/create-order', createRazorpayOrder);
router.post('/verify', verifyPayment);
router.get('/:paymentId', authorize('admin'), getPaymentDetails);
router.post('/refund', authorize('admin'), refundPayment);

export default router;
