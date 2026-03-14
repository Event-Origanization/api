import { Request, Response } from "express";
import { SeoMeta } from "@/models/SeoMeta";
import {
  sendSuccessResponse,
  sendErrorResponse,
} from "@/utils/responseFormatter";
import { MESSAGES, HTTP_STATUS } from "@/constants";
import { asyncHandler } from "@/middlewares/error";
import { PAGE_KEYS } from "@/constants/seo";

export const getAllSeoMeta = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const seoMetas = await SeoMeta.findAll();
    sendSuccessResponse(res, seoMetas, MESSAGES.SUCCESS.FETCHED);
  }
);

export const getSeoMetaByPage = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { pageKey } = req.params;
    
    // Validate pageKey
    if (!(Object.values(PAGE_KEYS) as string[]).includes(pageKey as string)) {
      return sendErrorResponse(res, MESSAGES.ERROR.VALIDATION_ERROR, HTTP_STATUS.BAD_REQUEST);
    }

    const seoMeta = await SeoMeta.findOne({ where: { pageKey } });

    if (!seoMeta) {
      return sendErrorResponse(res, MESSAGES.ERROR.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    sendSuccessResponse(res, seoMeta, MESSAGES.SUCCESS.FETCHED);
  }
);

export const updateSeoMeta = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { pageKey } = req.params;
    const updateData = req.body;

    // Validate pageKey
    if (!(Object.values(PAGE_KEYS) as string[]).includes(pageKey as string)) {
      return sendErrorResponse(res, MESSAGES.ERROR.VALIDATION_ERROR, HTTP_STATUS.BAD_REQUEST);
    }

    const [updatedCount] = await SeoMeta.update(updateData, {
      where: { pageKey },
    });

    if (updatedCount === 0) {
      // If not exists, create it
      const newSeoMeta = await SeoMeta.create({
        pageKey,
        ...updateData
      });
      return sendSuccessResponse(res, newSeoMeta, MESSAGES.SUCCESS.CREATED, HTTP_STATUS.CREATED);
    }

    const updatedSeoMeta = await SeoMeta.findOne({ where: { pageKey } });
    sendSuccessResponse(res, updatedSeoMeta, MESSAGES.SUCCESS.UPDATED);
  }
);
