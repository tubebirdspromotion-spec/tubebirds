import express from 'express';
import {
  getServices,
  getService,
  createService,
  updateService,
  deleteService
} from '../controllers/serviceController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validateId } from '../middleware/validateParams.js';

const router = express.Router();

router.get('/', getServices);
router.get('/:slug', getService);
router.post('/', protect, authorize('admin'), createService);
router.put('/:id', validateId, protect, authorize('admin'), updateService);
router.delete('/:id', validateId, protect, authorize('admin'), deleteService);

export default router;
