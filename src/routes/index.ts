import { Router, Request, Response } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import seoRoutes from "./seo.routes";
import configRoutes from "./website-config.routes";
import productRoutes from "./product.routes";
import postRoutes from "./post.routes";
import highlightVideoRoutes from "./highlight-video.routes";

import { ROUTES } from "@/constants";

const router = Router();

// Health check route
router.get(ROUTES.HEALTH, (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});

// API routes
router.use(ROUTES.AUTH, authRoutes);
router.use(ROUTES.USERS, userRoutes);
router.use(ROUTES.SEO, seoRoutes);
router.use(ROUTES.CONFIGS, configRoutes);
router.use(ROUTES.PRODUCTS, productRoutes);
router.use(ROUTES.POSTS, postRoutes);
router.use(ROUTES.HIGHLIGHT_VIDEOS, highlightVideoRoutes);

export default router;
