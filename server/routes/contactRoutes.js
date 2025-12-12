import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  submitContact,
  getContacts,
  getContact,
  updateContact,
  deleteContact
} from '../controllers/contactController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validateId } from '../middleware/validateParams.js';

const router = express.Router();

// Rate limiter for contact form submissions - 3 per hour per IP
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Max 5 contacts per hour
  message: 'Too many contact requests. Please try again after an hour.',
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/', contactLimiter, submitContact);
router.get('/', protect, authorize('admin'), getContacts);
router.get('/:id', validateId, protect, authorize('admin'), getContact);
router.put('/:id', validateId, protect, authorize('admin'), updateContact);
router.delete('/:id', validateId, protect, authorize('admin'), deleteContact);

export default router;
