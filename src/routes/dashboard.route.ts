import { Router } from 'express';
import { getOverview, getYearlyCharts } from '@/controllers/dashboard.controller';
import { authenticateToken, requireAdmin } from '@/middlewares/auth';
import { DASHBOARD_ROUTES } from '@/constants/routes';

const router = Router();

router.get(DASHBOARD_ROUTES.OVERVIEW, authenticateToken, requireAdmin, getOverview);
router.get(DASHBOARD_ROUTES.YEARLY_CHARTS, authenticateToken, requireAdmin, getYearlyCharts);

export default router;
