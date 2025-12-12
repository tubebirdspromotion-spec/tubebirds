import express from 'express';
import {
  getPricingPlans,
  getPricingPlan,
  createPricingPlan,
  updatePricingPlan,
  deletePricingPlan,
  updatePricingPrices
} from '../controllers/pricingController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validateId } from '../middleware/validateParams.js';

const router = express.Router();

router.get('/', getPricingPlans);
router.get('/:id', validateId, getPricingPlan);
router.post('/', protect, authorize('admin'), createPricingPlan);
router.put('/:id', validateId, protect, authorize('admin'), updatePricingPlan);
router.patch('/:id/prices', validateId, protect, authorize('admin'), updatePricingPrices);
router.delete('/:id', validateId, protect, authorize('admin'), deletePricingPlan);

export default router;
