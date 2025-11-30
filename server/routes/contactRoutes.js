import express from 'express';
import {
  submitContact,
  getContacts,
  getContact,
  updateContact,
  deleteContact
} from '../controllers/contactController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', submitContact);
router.get('/', protect, authorize('admin'), getContacts);
router.get('/:id', protect, authorize('admin'), getContact);
router.put('/:id', protect, authorize('admin'), updateContact);
router.delete('/:id', protect, authorize('admin'), deleteContact);

export default router;
