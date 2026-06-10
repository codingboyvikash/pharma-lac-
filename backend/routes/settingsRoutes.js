import express from 'express';
import { body } from 'express-validator';
import {
  changePassword,
  getSettings,
  updateProfile,
  updateSettings
} from '../controllers/settingsController.js';
import { getBanners, createBanner, updateBanner, deleteBanner } from '../controllers/bannerController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();
router.use(protect, adminOnly);

router.get('/', asyncHandler(getSettings));
router.put(
  '/',
  upload.fields([
    { name: 'siteLogo', maxCount: 1 },
    { name: 'favicon', maxCount: 1 }
  ]),
  asyncHandler(updateSettings)
);
router.get('/banners', asyncHandler(getBanners));
router.post('/banners', upload.array('images', 10), asyncHandler(createBanner));
router.put('/banners/:id', upload.array('images', 10), asyncHandler(updateBanner));
router.delete('/banners/:id', asyncHandler(deleteBanner));
router.put('/profile', [body('email').optional().isEmail()], validateRequest, asyncHandler(updateProfile));
router.put(
  '/password',
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters')
  ],
  validateRequest,
  asyncHandler(changePassword)
);

export default router;
