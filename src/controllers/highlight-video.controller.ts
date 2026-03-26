import { Request, Response } from 'express';
import { highlightVideoService } from '@/services/highlight-video.service';
import { CreateHighlightVideoRequest, UpdateHighlightVideoRequest } from '@/types';
import { sendSuccessResponse, sendErrorResponse } from '@/utils/responseFormatter';
import { HTTP_STATUS } from '@/constants';
import { uploadImage, deleteImageByUrl } from '@/utils/cloudinary';

export const getAllHighlightVideos = async (req: Request, res: Response) => {
  try {
    const {
      page,
      limit,
      search,
      isActive,
      sortBy,
      sortOrder,
    } = req.query;

    const result = await highlightVideoService.getAllHighlightVideos({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      search: search as string,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'ASC' | 'DESC',
    });

    return sendSuccessResponse(res, result, 'Lấy danh sách video nổi bật thành công');
  } catch (error) {
    return sendErrorResponse(
      res,
      'Lỗi khi lấy danh sách video nổi bật',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      (error as Error).message
    );
  }
};

export const getHighlightVideoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return sendErrorResponse(res, 'Thiếu ID video', HTTP_STATUS.BAD_REQUEST);
    }
    const video = await highlightVideoService.getHighlightVideoById(parseInt(id));

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

export const createHighlightVideo = async (req: Request, res: Response) => {
  try {
    const body: CreateHighlightVideoRequest = req.body;
    
    // Handle image upload to Cloudinary if a file was provided
    if (req.file) {
      const uploadResult = await uploadImage(req.file.buffer, 'highlight-videos');
      if (uploadResult.success && uploadResult.url) {
        body.thumbnail = uploadResult.url;
      }
    }
    
    const newVideo = await highlightVideoService.createHighlightVideo(body);
    return sendSuccessResponse(res, newVideo, 'Tạo video nổi bật mới thành công', HTTP_STATUS.CREATED);
  } catch (error) {
    return sendErrorResponse(
      res,
      'Lỗi khi tạo video nổi bật mới',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      (error as Error).message
    );
  }
};

export const updateHighlightVideo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return sendErrorResponse(res, 'Thiếu ID video', HTTP_STATUS.BAD_REQUEST);
    }
    const body: UpdateHighlightVideoRequest = req.body;
    
    // Check if video exists for potential image management
    const existingVideo = await highlightVideoService.getHighlightVideoById(parseInt(id));
    if (!existingVideo) {
      return sendErrorResponse(res, 'Không tìm thấy video để cập nhật', HTTP_STATUS.NOT_FOUND);
    }

    // Handle image upload to Cloudinary if a new file was provided
    if (req.file) {
      const uploadResult = await uploadImage(req.file.buffer, 'highlight-videos');
      if (uploadResult.success && uploadResult.url) {
        // Optionally delete the old image if it was on Cloudinary
        if (existingVideo.thumbnail && existingVideo.thumbnail.includes('cloudinary')) {
          await deleteImageByUrl(existingVideo.thumbnail);
        }
        body.thumbnail = uploadResult.url;
      }
    }
    
    const updatedVideo = await highlightVideoService.updateHighlightVideo(parseInt(id), body);
    
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

export const deleteHighlightVideo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return sendErrorResponse(res, 'Thiếu ID video', HTTP_STATUS.BAD_REQUEST);
    }
    const success = await highlightVideoService.deleteHighlightVideo(parseInt(id));

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
