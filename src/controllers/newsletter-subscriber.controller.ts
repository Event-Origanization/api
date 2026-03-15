import { Request, Response } from 'express';
import { newsletterSubscriberService } from '@/services/newsletter-subscriber.service';
import { CreateNewsletterSubscriberRequest, UpdateNewsletterSubscriberRequest } from '@/types';
import { sendSuccessResponse, sendErrorResponse } from '@/utils/responseFormatter';
import { HTTP_STATUS } from '@/constants';

export const subscribe = async (req: Request, res: Response) => {
  try {
    const body: CreateNewsletterSubscriberRequest = req.body;
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!body.email || !emailRegex.test(body.email)) {
      return sendErrorResponse(res, 'Email không hợp lệ', HTTP_STATUS.BAD_REQUEST);
    }

    const newSubscriber = await newsletterSubscriberService.subscribe(body);
    return sendSuccessResponse(res, newSubscriber, 'Đăng ký nhận tin thành công', HTTP_STATUS.CREATED);
  } catch (error) {
    return sendErrorResponse(
      res,
      'Lỗi khi đăng ký nhận tin',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      (error as Error).message
    );
  }
};

export const getAllSubscribers = async (req: Request, res: Response) => {
  try {
    const {
      page,
      limit,
      search,
      isActive,
      sortBy,
      sortOrder,
    } = req.query;

    const result = await newsletterSubscriberService.getAllSubscribers({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      search: search as string,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'ASC' | 'DESC',
    });

    return sendSuccessResponse(res, result, 'Lấy danh sách người đăng ký thành công');
  } catch (error) {
    return sendErrorResponse(
      res,
      'Lỗi khi lấy danh sách người đăng ký',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      (error as Error).message
    );
  }
};

export const updateSubscriber = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return sendErrorResponse(res, 'Thiếu ID người đăng ký', HTTP_STATUS.BAD_REQUEST);
    }
    const body: UpdateNewsletterSubscriberRequest = req.body;
    const updated = await newsletterSubscriberService.updateSubscriber(parseInt(id), body);

    if (!updated) {
      return sendErrorResponse(res, 'Không tìm thấy người đăng ký để cập nhật', HTTP_STATUS.NOT_FOUND);
    }

    return sendSuccessResponse(res, updated, 'Cập nhật trạng thái thành công');
  } catch (error) {
    return sendErrorResponse(
      res,
      'Lỗi khi cập nhật trạng thái',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      (error as Error).message
    );
  }
};

export const deleteSubscriber = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return sendErrorResponse(res, 'Thiếu ID người đăng ký', HTTP_STATUS.BAD_REQUEST);
    }
    const success = await newsletterSubscriberService.deleteSubscriber(parseInt(id));

    if (!success) {
      return sendErrorResponse(res, 'Không tìm thấy người đăng ký để xóa', HTTP_STATUS.NOT_FOUND);
    }

    return sendSuccessResponse(res, null, 'Xóa người đăng ký thành công');
  } catch (error) {
    return sendErrorResponse(
      res,
      'Lỗi khi xóa người đăng ký',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      (error as Error).message
    );
  }
};
