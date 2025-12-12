import express from 'express';
import {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  updateOrderStatus,
  updateOrderProgress,
  addOrderNote,
  deleteOrder,
  generateInvoice
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validateId } from '../middleware/validateParams.js';

const router = express.Router();

router.use(protect); // All routes require authentication

router.get('/', getOrders);
router.get('/:id', validateId, getOrder);
router.get('/:id/invoice', validateId, generateInvoice);
router.post('/', createOrder);
router.put('/:id', validateId, authorize('admin'), updateOrder);
router.put('/:id/status', validateId, authorize('admin'), updateOrderStatus);
router.put('/:id/progress', validateId, authorize('admin'), updateOrderProgress);
router.post('/:id/notes', validateId, addOrderNote);
router.delete('/:id', validateId, authorize('admin'), deleteOrder);

export default router;
