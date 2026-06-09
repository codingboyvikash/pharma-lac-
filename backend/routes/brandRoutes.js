import express from 'express';
import { body } from 'express-validator';
import { createBrand, deleteBrand, listBrands, updateBrand } from '../controllers/brandController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();
router.use(protect, adminOnly);

router.get('/', asyncHandler(listBrands));
router.post('/', upload.single('logo'), [body('brandName').trim().notEmpty().withMessage('Brand name is required')], validateRequest, asyncHandler(createBrand));
router.put('/:id', upload.single('logo'), asyncHandler(updateBrand));
router.delete('/:id', asyncHandler(deleteBrand));

export default router;
