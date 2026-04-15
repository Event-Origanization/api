import { Router } from 'express';
import * as ContactMessageController from '@/controllers/contactMessage.controller';
import { CONTACT_MESSAGE_ROUTES } from '@/constants/routes';
import { authenticateToken, requireAdmin } from '@/middlewares/auth';
import { contactRateLimiter } from '@/middlewares/rateLimiter';

const router = Router();

// Public routes (rate limited: 5 requests / 15 min / IP)
router.post(CONTACT_MESSAGE_ROUTES.CREATE, contactRateLimiter, ContactMessageController.createContactMessage);

// Admin routes (require auth)
router.get(CONTACT_MESSAGE_ROUTES.GET_ALL, authenticateToken, requireAdmin, ContactMessageController.getAllContactMessages);
router.get(CONTACT_MESSAGE_ROUTES.GET_BY_ID, authenticateToken, requireAdmin, ContactMessageController.getContactMessageById);
router.put(CONTACT_MESSAGE_ROUTES.MARK_AS_READ, authenticateToken, requireAdmin, ContactMessageController.markAsRead);
router.delete(CONTACT_MESSAGE_ROUTES.DELETE, authenticateToken, requireAdmin, ContactMessageController.deleteContactMessage);

export default router;
