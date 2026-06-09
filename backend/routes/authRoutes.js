import express from 'express';
import { body } from 'express-validator';
import { getProfile, loginAdmin } from '../controllers/authController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

router.post(
  '/login',
  [body('email').isEmail().withMessage('Valid email is required'), body('password').notEmpty()],
  validateRequest,
  asyncHandler(loginAdmin)
);
router.get('/profile', protect, adminOnly, asyncHandler(getProfile));

export default router;
