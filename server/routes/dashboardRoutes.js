import express from 'express';
import {
  getAdminDashboard,
  getClientDashboard,
  getAdminStats,
  getClientStats
} from '../controllers/dashboardController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// Simplified dashboard endpoints
router.get('/admin', authorize('admin'), getAdminDashboard);
router.get('/client', getClientDashboard);

// Detailed stats endpoints (legacy)
router.get('/admin/stats', authorize('admin'), getAdminStats);
router.get('/client/stats', getClientStats);

export default router;
