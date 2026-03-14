import { Router } from 'express';
import * as ProductController from '@/controllers/product.controller';
import { PRODUCT_ROUTES } from '@/constants/routes';
import { authenticateToken, requireAdmin } from '@/middlewares/auth';

const router = Router();

// Public routes
router.get(PRODUCT_ROUTES.GET_ALL, ProductController.getAllProducts);
router.get(PRODUCT_ROUTES.GET_BY_ID, ProductController.getProductById);
router.get(PRODUCT_ROUTES.GET_BY_SLUG, ProductController.getProductBySlug);

// Admin only routes
router.post(PRODUCT_ROUTES.CREATE, authenticateToken, requireAdmin, ProductController.createProduct);
router.put(PRODUCT_ROUTES.UPDATE, authenticateToken, requireAdmin, ProductController.updateProduct);
router.delete(PRODUCT_ROUTES.DELETE, authenticateToken, requireAdmin, ProductController.deleteProduct);

export default router;
