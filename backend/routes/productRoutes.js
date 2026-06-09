import express from 'express';
import { body } from 'express-validator';
import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  productPrerequisites,
  updateProduct
} from '../controllers/productController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();
const productUpload = upload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'galleryImages', maxCount: 10 }
]);

router.use(protect, adminOnly);

router.get('/prerequisites', asyncHandler(productPrerequisites));
router.get('/', asyncHandler(listProducts));
router.get('/:id', asyncHandler(getProduct));
router.post(
  '/',
  productUpload,
  [
    body('productName').trim().notEmpty().withMessage('Product name is required'),
    body('categoryId').isMongoId().withMessage('Valid category is required'),
    body('brandId').isMongoId().withMessage('Valid brand is required'),
    body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
    body('sku').trim().notEmpty().withMessage('SKU is required')
  ],
  validateRequest,
  asyncHandler(createProduct)
);
router.put('/:id', productUpload, asyncHandler(updateProduct));
router.delete('/:id', asyncHandler(deleteProduct));

export default router;
