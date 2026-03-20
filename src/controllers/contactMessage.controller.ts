import { Request, Response } from 'express';
import { contactMessageService } from '@/services/contactMessage.service';
import { CreateContactMessageRequest, UpdateContactMessageRequest, ContactMessageQueryOptions } from '@/types';
import { sendSuccessResponse, sendErrorResponse } from '@/utils/responseFormatter';
import { HTTP_STATUS } from '@/constants';

export const getAllContactMessages = async (req: Request, res: Response) => {
  try {
    const { page, limit, search, isRead, sortBy, sortOrder } = req.query;

    const query: ContactMessageQueryOptions = {
      page: page ? parseInt(page as string, 10) : undefined,
      limit: limit ? parseInt(limit as string, 10) : undefined,
      search: search as string | undefined,
      isRead: isRead === 'true' ? true : isRead === 'false' ? false : undefined,
      sortBy: sortBy as string | undefined,
      sortOrder: (sortOrder as 'ASC' | 'DESC') || undefined,
    };

    const result = await contactMessageService.getAllContactMessages(query);
    return sendSuccessResponse(res, result, 'Lấy danh sách tin nhắn liên hệ thành công');
  } catch (error) {
    return sendErrorResponse(
      res,
      'Lỗi khi lấy danh sách tin nhắn liên hệ',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      (error as Error).message
    );
  }
};

export const getContactMessageById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return sendErrorResponse(res, 'Thiếu ID tin nhắn', HTTP_STATUS.BAD_REQUEST);
    }
    const message = await contactMessageService.getContactMessageById(parseInt(id, 10));

    if (!message) {
      return sendErrorResponse(res, 'Không tìm thấy tin nhắn', HTTP_STATUS.NOT_FOUND);
    }

    return sendSuccessResponse(res, message, 'Lấy chi tiết tin nhắn thành công');
  } catch (error) {
    return sendErrorResponse(
      res,
      'Lỗi khi lấy chi tiết tin nhắn',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      (error as Error).message
    );
  }
};

export const createContactMessage = async (req: Request, res: Response) => {
  try {
    const body: CreateContactMessageRequest = req.body;

    if (!body.name || !body.email || !body.message) {
      return sendErrorResponse(res, 'Vui lòng điền đủ Tên, Email và Nội dung', HTTP_STATUS.BAD_REQUEST);
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return sendErrorResponse(res, 'Email không hợp lệ', HTTP_STATUS.BAD_REQUEST);
    }

    const newMessage = await contactMessageService.createContactMessage(body);
    return sendSuccessResponse(res, newMessage, 'Gửi tin nhắn liên hệ thành công', HTTP_STATUS.CREATED);
  } catch (error) {
    return sendErrorResponse(
      res,
      'Lỗi khi gửi tin nhắn liên hệ',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      (error as Error).message
    );
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return sendErrorResponse(res, 'Thiếu ID tin nhắn', HTTP_STATUS.BAD_REQUEST);
    }

    const body: UpdateContactMessageRequest = req.body;
    if (body.isRead === undefined) {
      return sendErrorResponse(res, 'Thiếu trường isRead', HTTP_STATUS.BAD_REQUEST);
    }

    const updatedMessage = await contactMessageService.markAsRead(parseInt(id, 10), body);

    if (!updatedMessage) {
      return sendErrorResponse(res, 'Không tìm thấy tin nhắn để cập nhật', HTTP_STATUS.NOT_FOUND);
    }

    return sendSuccessResponse(res, updatedMessage, 'Cập nhật trạng thái tin nhắn thành công');
  } catch (error) {
    return sendErrorResponse(
      res,
      'Lỗi khi cập nhật trạng thái tin nhắn',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      (error as Error).message
    );
  }
};

export const deleteContactMessage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return sendErrorResponse(res, 'Thiếu ID tin nhắn', HTTP_STATUS.BAD_REQUEST);
    }

    const success = await contactMessageService.deleteContactMessage(parseInt(id, 10));

    if (!success) {
      return sendErrorResponse(res, 'Không tìm thấy tin nhắn để xóa', HTTP_STATUS.NOT_FOUND);
    }

    return sendSuccessResponse(res, null, 'Xóa tin nhắn liên hệ thành công');
  } catch (error) {
    return sendErrorResponse(
      res,
      'Lỗi khi xóa tin nhắn',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      (error as Error).message
    );
  }
};
