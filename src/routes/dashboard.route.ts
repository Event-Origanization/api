import { Router } from 'express';
import { getOverview, getYearlyCharts } from '@/controllers/dashboard.controller';

const router = Router();

router.get('/overview', getOverview);
router.get('/charts/yearly', getYearlyCharts);

export default router;
