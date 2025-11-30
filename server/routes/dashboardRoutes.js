import express from 'express';
import {
  getAdminStats,
  getClientStats
} from '../controllers/dashboardController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/admin/stats', authorize('admin'), getAdminStats);
router.get('/client/stats', getClientStats);

export default router;
