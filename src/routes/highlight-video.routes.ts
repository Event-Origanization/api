import { Router } from 'express';
import * as HighlightVideoController from '@/controllers/highlight-video.controller';
import { HIGHLIGHT_VIDEO_ROUTES } from '@/constants/routes';
import { authenticateToken, requireAdmin } from '@/middlewares/auth';
import { uploadSingleWithError } from '@/utils/multer';

const router = Router();

// Public routes
router.get(HIGHLIGHT_VIDEO_ROUTES.GET_ALL, HighlightVideoController.getAllHighlightVideos);
router.get(HIGHLIGHT_VIDEO_ROUTES.GET_BY_ID, HighlightVideoController.getHighlightVideoById);

// Admin only routes
router.post(HIGHLIGHT_VIDEO_ROUTES.CREATE, authenticateToken, requireAdmin, uploadSingleWithError('image'), HighlightVideoController.createHighlightVideo);
router.put(HIGHLIGHT_VIDEO_ROUTES.UPDATE, authenticateToken, requireAdmin, uploadSingleWithError('image'), HighlightVideoController.updateHighlightVideo);
router.delete(HIGHLIGHT_VIDEO_ROUTES.DELETE, authenticateToken, requireAdmin, HighlightVideoController.deleteHighlightVideo);

export default router;
