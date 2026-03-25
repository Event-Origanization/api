import { Router } from 'express';
import * as HomeVideoController from '@/controllers/home-video.controller';
import { HOME_VIDEO_ROUTES } from '@/constants/routes';
import { authenticateToken, requireAdmin } from '@/middlewares/auth';
import { uploadSingleWithError } from '@/utils/multer';

const router = Router();

// Public routes
router.get(HOME_VIDEO_ROUTES.GET_ALL, HomeVideoController.getAllHomeVideos);
router.get(HOME_VIDEO_ROUTES.GET_BY_ID, HomeVideoController.getHomeVideoById);

// Admin only routes
router.post(HOME_VIDEO_ROUTES.CREATE, authenticateToken, requireAdmin, uploadSingleWithError('image'), HomeVideoController.createHomeVideo);
router.put(HOME_VIDEO_ROUTES.UPDATE, authenticateToken, requireAdmin, uploadSingleWithError('image'), HomeVideoController.updateHomeVideo);
router.delete(HOME_VIDEO_ROUTES.DELETE, authenticateToken, requireAdmin, HomeVideoController.deleteHomeVideo);

export default router;
