import { Router } from 'express';
import HighlightController from '@/controllers/highlight.controller';
import { authenticateToken, requireAdmin } from '@/middlewares/auth';

const router = Router();

// Public routes
router.get('/', (req, res) => HighlightController.getPublicHighlights(req, res));

// Admin routes
router.get('/admin', authenticateToken, requireAdmin, (req, res) => HighlightController.getAllHighlights(req, res));
router.get('/:id', authenticateToken, requireAdmin, (req, res) => HighlightController.getHighlightById(req, res));
router.post('/', authenticateToken, requireAdmin, (req, res) => HighlightController.createHighlight(req, res));
router.put('/:id', authenticateToken, requireAdmin, (req, res) => HighlightController.updateHighlight(req, res));
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => HighlightController.deleteHighlight(req, res));

export default router;
