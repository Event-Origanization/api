import { Router } from 'express';
import * as NewsletterSubscriberController from '@/controllers/newsletter-subscriber.controller';
import { NEWSLETTER_ROUTES } from '@/constants/routes';
import { authenticateToken, requireAdmin } from '@/middlewares/auth';

const router = Router();

// Public route for subscription
router.post(NEWSLETTER_ROUTES.SUBSCRIBE, NewsletterSubscriberController.subscribe);

// Admin only routes for management
router.get(NEWSLETTER_ROUTES.GET_ALL, authenticateToken, requireAdmin, NewsletterSubscriberController.getAllSubscribers);
router.put(NEWSLETTER_ROUTES.UPDATE, authenticateToken, requireAdmin, NewsletterSubscriberController.updateSubscriber);
router.delete(NEWSLETTER_ROUTES.DELETE, authenticateToken, requireAdmin, NewsletterSubscriberController.deleteSubscriber);

export default router;
