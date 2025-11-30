import express from 'express';
import {
  submitReview,
  getReviews,
  getReview,
  approveReview,
  deleteReview
} from '../controllers/reviewController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getReviews);
router.get('/:id', getReview);

// Protected routes - Client can submit reviews
router.post('/', protect, authorize('client'), submitReview);

// Admin only routes
router.patch('/:id/approve', protect, authorize('admin'), approveReview);
router.delete('/:id', protect, authorize('admin'), deleteReview);

export default router;
