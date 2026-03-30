import { Response } from 'express';
import { 
  AuthenticatedRequest, 
  CreateHighlightRequest, 
  UpdateHighlightRequest, 
} from '@/types';
import HighlightService from '@/services/highlight.service';
import { sendSuccessResponse, sendErrorResponse } from '@/utils/responseFormatter';
import { HTTP_STATUS } from '@/constants';

class HighlightController {
  public async createHighlight(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const data: CreateHighlightRequest = req.body;
      const highlight = await HighlightService.createHighlight(data);
      sendSuccessResponse(res, highlight, 'Tạo nội dung nổi bật thành công', HTTP_STATUS.CREATED);
    } catch (error: unknown) {
      sendErrorResponse(res, 'Lỗi khi tạo nội dung nổi bật', HTTP_STATUS.INTERNAL_SERVER_ERROR, error instanceof Error ? error.message : String(error));
    }
  }

  public async updateHighlight(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        return sendErrorResponse(res, 'Thiếu ID nội dung nổi bật', HTTP_STATUS.BAD_REQUEST);
      }
      const data: UpdateHighlightRequest = req.body;
      const highlight = await HighlightService.updateHighlight(parseInt(id), data);
      
      if (!highlight) {
        return sendErrorResponse(res, 'Không tìm thấy nội dung nổi bật', HTTP_STATUS.NOT_FOUND);
      }
      
      sendSuccessResponse(res, highlight, 'Cập nhật nội dung nổi bật thành công');
    } catch (error: unknown) {
      sendErrorResponse(res, 'Lỗi khi cập nhật nội dung nổi bật', HTTP_STATUS.INTERNAL_SERVER_ERROR, error instanceof Error ? error.message : String(error));
    }
  }

  public async deleteHighlight(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        return sendErrorResponse(res, 'Thiếu ID nội dung nổi bật', HTTP_STATUS.BAD_REQUEST);
      }
      const success = await HighlightService.deleteHighlight(parseInt(id));
      
      if (!success) {
        return sendErrorResponse(res, 'Không tìm thấy nội dung nổi bật', HTTP_STATUS.NOT_FOUND);
      }
      
      sendSuccessResponse(res, null, 'Xóa nội dung nổi bật thành công');
    } catch (error: unknown) {
      sendErrorResponse(res, 'Lỗi khi xóa nội dung nổi bật', HTTP_STATUS.INTERNAL_SERVER_ERROR, error instanceof Error ? error.message : String(error));
    }
  }

  public async getHighlightById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        return sendErrorResponse(res, 'Thiếu ID nội dung nổi bật', HTTP_STATUS.BAD_REQUEST);
      }
      const highlight = await HighlightService.getHighlightById(parseInt(id));
      
      if (!highlight) {
        return sendErrorResponse(res, 'Không tìm thấy nội dung nổi bật', HTTP_STATUS.NOT_FOUND);
      }
      
      sendSuccessResponse(res, highlight);
    } catch (error: unknown) {
      sendErrorResponse(res, 'Lỗi khi lấy thông tin nội dung nổi bật', HTTP_STATUS.INTERNAL_SERVER_ERROR, error instanceof Error ? error.message : String(error));
    }
  }

  public async getAllHighlights(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { page, limit, sortBy, sortOrder, search } = req.query;
      const query = {
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
        sortBy: sortBy as string || 'orderIndex',
        sortOrder: (sortOrder as string)?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC' as 'ASC' | 'DESC',
        search: search as string
      };

      const { highlights, ...pagination } = await HighlightService.getAllHighlights(query);
      sendSuccessResponse(res, {
        highlights,
        pagination
      }, 'Lấy danh sách thành công', HTTP_STATUS.OK);
    } catch (error: unknown) {
      sendErrorResponse(res, 'Lỗi khi lấy danh sách nội dung nổi bật', HTTP_STATUS.INTERNAL_SERVER_ERROR, error instanceof Error ? error.message : String(error));
    }
  }

  public async getPublicHighlights(_req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const highlights = await HighlightService.getPublicHighlights();
      sendSuccessResponse(res, highlights);
    } catch (error: unknown) {
      sendErrorResponse(res, 'Lỗi khi lấy danh sách nội dung nổi bật công khai', HTTP_STATUS.INTERNAL_SERVER_ERROR, error instanceof Error ? error.message : String(error));
    }
  }
}

export default new HighlightController();
