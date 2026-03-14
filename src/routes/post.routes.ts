import { Router } from 'express';
import * as PostController from '@/controllers/post.controller';
import { POST_ROUTES } from '@/constants/routes';
import { authenticateToken, requireAdmin } from '@/middlewares/auth';

const router = Router();

// Public routes
router.get(POST_ROUTES.GET_ALL, PostController.getAllPosts);
router.get(POST_ROUTES.GET_BY_ID, PostController.getPostById);
router.get(POST_ROUTES.GET_BY_SLUG, PostController.getPostBySlug);

// Admin only routes
router.post(POST_ROUTES.CREATE, authenticateToken, requireAdmin, PostController.createPost);
router.put(POST_ROUTES.UPDATE, authenticateToken, requireAdmin, PostController.updatePost);
router.delete(POST_ROUTES.DELETE, authenticateToken, requireAdmin, PostController.deletePost);

export default router;
