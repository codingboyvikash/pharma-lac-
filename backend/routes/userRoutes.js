import express from 'express';
import { deleteUser, getUser, listUsers } from '../controllers/userController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();
router.use(protect, adminOnly);

router.get('/', asyncHandler(listUsers));
router.get('/:id', asyncHandler(getUser));
router.delete('/:id', asyncHandler(deleteUser));

export default router;
