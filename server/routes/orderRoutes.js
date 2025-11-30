import express from 'express';
import {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  updateOrderProgress,
  addOrderNote,
  deleteOrder
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All routes require authentication

router.get('/', getOrders);
router.get('/:id', getOrder);
router.post('/', createOrder);
router.put('/:id', authorize('admin'), updateOrder);
router.put('/:id/progress', authorize('admin'), updateOrderProgress);
router.post('/:id/notes', addOrderNote);
router.delete('/:id', authorize('admin'), deleteOrder);

export default router;
