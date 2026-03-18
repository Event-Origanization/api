import { Router } from 'express';
import * as PartnerController from '@/controllers/partner.controller';
import { PARTNER_ROUTES } from '@/constants/routes';
import { authenticateToken, requireAdmin } from '@/middlewares/auth';

const router = Router();

// Public routes
router.get(PARTNER_ROUTES.GET_ACTIVE, PartnerController.getActivePartners);

// Admin routes (require auth)
router.get(PARTNER_ROUTES.GET_ALL, authenticateToken, requireAdmin, PartnerController.getAllPartners);
router.get(PARTNER_ROUTES.GET_BY_ID, authenticateToken, requireAdmin, PartnerController.getPartnerById);
router.post(PARTNER_ROUTES.CREATE, authenticateToken, requireAdmin, PartnerController.createPartner);
router.put(PARTNER_ROUTES.UPDATE, authenticateToken, requireAdmin, PartnerController.updatePartner);
router.delete(PARTNER_ROUTES.DELETE, authenticateToken, requireAdmin, PartnerController.deletePartner);

export default router;
