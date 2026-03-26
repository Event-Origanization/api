import { Request, Response } from 'express';
import { partnerService } from '@/services/partner.service';
import { CreatePartnerRequest, UpdatePartnerRequest, PartnerQueryOptions } from '@/types';
import { sendSuccessResponse, sendErrorResponse } from '@/utils/responseFormatter';
import { HTTP_STATUS } from '@/constants';
import { uploadImage, deleteImageByUrl } from '@/utils/cloudinary';

export const getAllPartners = async (req: Request, res: Response) => {
  try {
    const { page, limit, search, isActive, sortBy, sortOrder } = req.query;

    const query: PartnerQueryOptions = {
      page: page ? parseInt(page as string, 10) : undefined,
      limit: limit ? parseInt(limit as string, 10) : undefined,
      search: search as string | undefined,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
      sortBy: sortBy as string | undefined,
      sortOrder: (sortOrder as 'ASC' | 'DESC') || undefined,
    };

    const result = await partnerService.getAllPartners(query);
    return sendSuccessResponse(res, result, 'Lấy danh sách đối tác thành công');
  } catch (error) {
    return sendErrorResponse(
      res,
      'Lỗi khi lấy danh sách đối tác',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      (error as Error).message
    );
  }
};

export const getActivePartners = async (_req: Request, res: Response) => {
  try {
    const partners = await partnerService.getActivePartners();
    return sendSuccessResponse(res, partners, 'Lấy danh sách đối tác active thành công');
  } catch (error) {
    return sendErrorResponse(
      res,
      'Lỗi khi lấy danh sách đối tác active',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      (error as Error).message
    );
  }
};

export const getPartnerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return sendErrorResponse(res, 'Thiếu ID đối tác', HTTP_STATUS.BAD_REQUEST);
    }
    const partner = await partnerService.getPartnerById(parseInt(id, 10));

    if (!partner) {
      return sendErrorResponse(res, 'Không tìm thấy đối tác', HTTP_STATUS.NOT_FOUND);
    }

    return sendSuccessResponse(res, partner, 'Lấy thông tin đối tác thành công');
  } catch (error) {
    return sendErrorResponse(
      res,
      'Lỗi khi lấy thông tin đối tác',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      (error as Error).message
    );
  }
};

export const createPartner = async (req: Request, res: Response) => {
  try {
    const body: CreatePartnerRequest = req.body;

    if (!body.name || body.name.trim() === '') {
      return sendErrorResponse(res, 'Tên đối tác không được để trống', HTTP_STATUS.BAD_REQUEST);
    }

    // Handle image upload to Cloudinary if a file was provided
    if (req.file) {
      const uploadResult = await uploadImage(req.file.buffer, 'partners');
      if (uploadResult.success && uploadResult.url) {
        body.logo = uploadResult.url;
      }
    }

    const newPartner = await partnerService.createPartner(body);
    return sendSuccessResponse(res, newPartner, 'Tạo đối tác mới thành công', HTTP_STATUS.CREATED);
  } catch (error) {
    return sendErrorResponse(
      res,
      'Lỗi khi tạo đối tác mới',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      (error as Error).message
    );
  }
};

export const updatePartner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return sendErrorResponse(res, 'Thiếu ID đối tác', HTTP_STATUS.BAD_REQUEST);
    }

    const body: UpdatePartnerRequest = req.body;

    // Check if partner exists for potential image management
    const existingPartner = await partnerService.getPartnerById(parseInt(id, 10));
    if (!existingPartner) {
      return sendErrorResponse(res, 'Không tìm thấy đối tác để cập nhật', HTTP_STATUS.NOT_FOUND);
    }

    // Handle image upload to Cloudinary if a new file was provided
    if (req.file) {
      const uploadResult = await uploadImage(req.file.buffer, 'partners');
      if (uploadResult.success && uploadResult.url) {
        // Optionally delete the old image if it was on Cloudinary
        if (existingPartner.logo && existingPartner.logo.includes('cloudinary')) {
          await deleteImageByUrl(existingPartner.logo);
        }
        body.logo = uploadResult.url;
      }
    }

    const updatedPartner = await partnerService.updatePartner(parseInt(id, 10), body);
    
    return sendSuccessResponse(res, updatedPartner, 'Cập nhật đối tác thành công');
  } catch (error) {
    return sendErrorResponse(
      res,
      'Lỗi khi cập nhật đối tác',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      (error as Error).message
    );
  }
};

export const deletePartner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return sendErrorResponse(res, 'Thiếu ID đối tác', HTTP_STATUS.BAD_REQUEST);
    }

    const success = await partnerService.deletePartner(parseInt(id, 10));

    if (!success) {
      return sendErrorResponse(res, 'Không tìm thấy đối tác để xóa', HTTP_STATUS.NOT_FOUND);
    }

    return sendSuccessResponse(res, null, 'Xóa đối tác thành công');
  } catch (error) {
    return sendErrorResponse(
      res,
      'Lỗi khi xóa đối tác',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      (error as Error).message
    );
  }
};
