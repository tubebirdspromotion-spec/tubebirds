import express from 'express';
import {
  getPricingPlans,
  getPricingPlan,
  createPricingPlan,
  updatePricingPlan,
  deletePricingPlan
} from '../controllers/pricingController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getPricingPlans);
router.get('/:id', getPricingPlan);
router.post('/', protect, authorize('admin'), createPricingPlan);
router.put('/:id', protect, authorize('admin'), updatePricingPlan);
router.delete('/:id', protect, authorize('admin'), deletePricingPlan);

export default router;
