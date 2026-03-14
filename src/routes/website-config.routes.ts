import { Router } from 'express';
import * as WebsiteConfigController from '@/controllers/website-config.controller';
import { WEBSITE_CONFIG_ROUTES } from '@/constants/routes';
import { authenticateToken, requireAdmin } from '@/middlewares/auth';

const router = Router();

// Public routes
router.get(WEBSITE_CONFIG_ROUTES.GET_ALL, WebsiteConfigController.getAllConfigs);
router.get(WEBSITE_CONFIG_ROUTES.GET_BY_GROUP, WebsiteConfigController.getConfigsByGroup);

// Admin only routes
router.put(WEBSITE_CONFIG_ROUTES.BULK_UPDATE, authenticateToken, requireAdmin, WebsiteConfigController.bulkUpdateConfigs);
router.put(WEBSITE_CONFIG_ROUTES.UPDATE, authenticateToken, requireAdmin, WebsiteConfigController.updateConfig);

export default router;
