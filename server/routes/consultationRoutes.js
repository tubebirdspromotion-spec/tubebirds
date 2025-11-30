import express from 'express';
import {
  submitConsultation,
  getConsultations,
  getConsultation,
  updateConsultation,
  deleteConsultation
} from '../controllers/consultationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public route - Submit consultation
router.post('/', submitConsultation);

// Protected routes - Admin only
router.use(protect);
router.use(authorize('admin'));

router.get('/', getConsultations);
router.get('/:id', getConsultation);
router.patch('/:id', updateConsultation);
router.delete('/:id', deleteConsultation);

export default router;
