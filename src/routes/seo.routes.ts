import { Router } from "express";
import * as SeoController from "@/controllers/seo.controller";
import { SEO_ROUTES } from "@/constants";
import { authenticateToken, requireAdmin } from "@/middlewares/auth";

const router = Router();

// Public routes
router.get(SEO_ROUTES.BASE, SeoController.getAllSeoMeta);
router.get(SEO_ROUTES.GET_BY_PAGE, SeoController.getSeoMetaByPage);

// Admin only routes
router.put(SEO_ROUTES.UPDATE, authenticateToken, requireAdmin, SeoController.updateSeoMeta);

export default router;
