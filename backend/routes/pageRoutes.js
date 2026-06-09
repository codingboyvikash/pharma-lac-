import express from 'express';
import { listPages, updatePage } from '../controllers/pageController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();
router.use(protect, adminOnly);

router.get('/', asyncHandler(listPages));
router.put('/:slug', asyncHandler(updatePage));

export default router;
