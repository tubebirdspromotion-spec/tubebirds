import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  submitConsultation,
  getConsultations,
  getConsultation,
  updateConsultation,
  deleteConsultation
} from '../controllers/consultationController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validateId } from '../middleware/validateParams.js';

const router = express.Router();

// Rate limiter for consultation submissions - 2 per hour per IP
const consultationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Max 2 consultations per hour
  message: 'Too many consultation requests. Please try again after an hour.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Public route - Submit consultation
router.post('/', consultationLimiter, submitConsultation);

// Protected routes - Admin only
router.use(protect);
router.use(authorize('admin'));

router.get('/', getConsultations);
router.get('/:id', validateId, getConsultation);
router.patch('/:id', validateId, updateConsultation);
router.delete('/:id', validateId, deleteConsultation);

export default router;
