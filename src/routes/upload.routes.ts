import { Router } from 'express';
import { uploadEditorImage } from '@/controllers/upload.controller';
import { authenticateToken } from '@/middlewares/auth';
import { uploadSingleWithError } from '@/utils/multer';
import { UPLOAD_ROUTES } from '@/constants/routes';

const router = Router();

// TinyMCE's default file field name is "file"
router.post(UPLOAD_ROUTES.IMAGE, authenticateToken, uploadSingleWithError('file'), uploadEditorImage);

export default router;
