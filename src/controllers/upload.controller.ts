import { Request, Response } from 'express';
import { sendSuccessResponse, sendErrorResponse } from '@/utils/responseFormatter';
import { HTTP_STATUS } from '@/constants';
import { uploadImage } from '@/utils/cloudinary';

export const uploadEditorImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return sendErrorResponse(res, 'Không có file nào được tải lên', HTTP_STATUS.BAD_REQUEST);
    }

    const uploadResult = await uploadImage(req.file.buffer, 'editor');

    if (uploadResult.success && uploadResult.url) {
      return sendSuccessResponse(res, { location: uploadResult.url }, 'Tải ảnh thành công');
    }

    return sendErrorResponse(res, 'Lỗi khi tải ảnh lên Cloudinary', HTTP_STATUS.INTERNAL_SERVER_ERROR);
  } catch (error) {
    return sendErrorResponse(
      res,
      'Lỗi server khi tải ảnh',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      (error as Error).message
    );
  }
};
