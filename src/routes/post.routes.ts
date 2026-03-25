import { Router } from 'express';
import * as PostController from '@/controllers/post.controller';
import { POST_ROUTES } from '@/constants/routes';
import { authenticateToken, requireAdmin, optionalAuth } from '@/middlewares/auth';
import { uploadSingleWithError } from '@/utils/multer';

const router = Router();

// Public routes
router.get(POST_ROUTES.GET_ALL, optionalAuth, PostController.getAllPosts);
router.get(POST_ROUTES.GET_BY_ID, optionalAuth, PostController.getPostById);
router.get(POST_ROUTES.GET_BY_SLUG, optionalAuth, PostController.getPostBySlug);

// Admin only routes
router.post(POST_ROUTES.CREATE, authenticateToken, requireAdmin, uploadSingleWithError('image'), PostController.createPost);
router.put(POST_ROUTES.UPDATE, authenticateToken, requireAdmin, uploadSingleWithError('image'), PostController.updatePost);
router.post('/score-seo', authenticateToken, requireAdmin, PostController.scoreSeo);
router.delete(POST_ROUTES.DELETE, authenticateToken, requireAdmin, PostController.deletePost);

export default router;
