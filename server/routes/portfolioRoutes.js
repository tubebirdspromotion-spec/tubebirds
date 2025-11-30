import express from 'express';
import {
  getPortfolioItems,
  getPortfolioItem,
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem
} from '../controllers/portfolioController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getPortfolioItems);
router.get('/:id', getPortfolioItem);
router.post('/', protect, authorize('admin'), createPortfolioItem);
router.put('/:id', protect, authorize('admin'), updatePortfolioItem);
router.delete('/:id', protect, authorize('admin'), deletePortfolioItem);

export default router;
