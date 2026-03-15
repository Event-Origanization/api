import { Request, Response } from 'express';
import { homeVideoService } from '@/services/home-video.service';
import { CreateHomeVideoRequest, UpdateHomeVideoRequest } from '@/types';
import { sendSuccessResponse, sendErrorResponse } from '@/utils/responseFormatter';
import { HTTP_STATUS } from '@/constants';

export const getAllHomeVideos = async (req: Request, res: Response) => {
  try {
    const {
      page,
      limit,
      search,
      isActive,
      sortBy,
      sortOrder,
    } = req.query;

    const result = await homeVideoService.getAllHomeVideos({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      search: search as string,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'ASC' | 'DESC',
    });

    return sendSuccessResponse(res, result, 'Lấy danh sách video trang chủ thành công');
  } catch (error) {
    return sendErrorResponse(
      res,
      'Lỗi khi lấy danh sách video trang chủ',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      (error as Error).message
    );
  }
};

export const getHomeVideoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return sendErrorResponse(res, 'Thiếu ID video', HTTP_STATUS.BAD_REQUEST);
    }
    const video = await homeVideoService.getHomeVideoById(parseInt(id));

    if (!video) {
      return sendErrorResponse(res, 'Không tìm thấy video', HTTP_STATUS.NOT_FOUND);
    }

    return sendSuccessResponse(res, video, 'Lấy thông tin video thành công');
  } catch (error) {
    return sendErrorResponse(
      res,
      'Lỗi khi lấy thông tin video',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      (error as Error).message
    );
  }
};

export const createHomeVideo = async (req: Request, res: Response) => {
  try {
    const body: CreateHomeVideoRequest = req.body;
    const newVideo = await homeVideoService.createHomeVideo(body);
    return sendSuccessResponse(res, newVideo, 'Tạo video trang chủ mới thành công', HTTP_STATUS.CREATED);
  } catch (error) {
    return sendErrorResponse(
      res,
      'Lỗi khi tạo video trang chủ mới',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      (error as Error).message
    );
  }
};

export const updateHomeVideo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return sendErrorResponse(res, 'Thiếu ID video', HTTP_STATUS.BAD_REQUEST);
    }
    const body: UpdateHomeVideoRequest = req.body;
    const updatedVideo = await homeVideoService.updateHomeVideo(parseInt(id), body);

    if (!updatedVideo) {
      return sendErrorResponse(res, 'Không tìm thấy video để cập nhật', HTTP_STATUS.NOT_FOUND);
    }

    return sendSuccessResponse(res, updatedVideo, 'Cập nhật video thành công');
  } catch (error) {
    return sendErrorResponse(
      res,
      'Lỗi khi cập nhật video',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      (error as Error).message
    );
  }
};

export const deleteHomeVideo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return sendErrorResponse(res, 'Thiếu ID video', HTTP_STATUS.BAD_REQUEST);
    }
    const success = await homeVideoService.deleteHomeVideo(parseInt(id));

    if (!success) {
      return sendErrorResponse(res, 'Không tìm thấy video để xóa', HTTP_STATUS.NOT_FOUND);
    }

    return sendSuccessResponse(res, null, 'Xóa video thành công');
  } catch (error) {
    return sendErrorResponse(
      res,
      'Lỗi khi xóa video',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      (error as Error).message
    );
  }
};
