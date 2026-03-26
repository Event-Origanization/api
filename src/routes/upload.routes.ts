import { Router } from 'express';
import { uploadEditorImage } from '@/controllers/upload.controller';
import { authenticateToken } from '@/middlewares/auth';
import { uploadSingleWithError } from '@/utils/multer';

const router = Router();

// TinyMCE's default file field name is "file"
router.post('/image', authenticateToken, uploadSingleWithError('file'), uploadEditorImage);

export default router;
