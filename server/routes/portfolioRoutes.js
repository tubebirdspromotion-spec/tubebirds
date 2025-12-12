import express from 'express';
import {
  getPortfolioItems,
  getPortfolioItem,
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem
} from '../controllers/portfolioController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validateId } from '../middleware/validateParams.js';

const router = express.Router();

router.get('/', getPortfolioItems);
router.get('/:id', validateId, getPortfolioItem);
router.post('/', protect, authorize('admin'), createPortfolioItem);
router.put('/:id', validateId, protect, authorize('admin'), updatePortfolioItem);
router.delete('/:id', validateId, protect, authorize('admin'), deletePortfolioItem);

export default router;
