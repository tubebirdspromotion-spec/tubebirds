import express from 'express';
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validateId } from '../middleware/validateParams.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/', getUsers);
router.get('/:id', validateId, getUser);
router.put('/:id', validateId, updateUser);
router.delete('/:id', validateId, deleteUser);

export default router;
