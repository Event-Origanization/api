import { Request, Response } from 'express';
import { postService } from '@/services/post.service';
import { CreatePostRequest, UpdatePostRequest } from '@/types';
import { sendSuccessResponse, sendErrorResponse } from '@/utils/responseFormatter';
import { HTTP_STATUS } from '@/constants';

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const {
      page,
      limit,
      search,
      status,
      sortBy,
      sortOrder,
    } = req.query;

    const result = await postService.getAllPosts({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      search: search as string,
      status: status as string,
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'ASC' | 'DESC',
    });

    return sendSuccessResponse(res, result, 'Lấy danh sách bài viết thành công');
  } catch (error) {
    return sendErrorResponse(
      res,
      'Lỗi khi lấy danh sách bài viết',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      (error as Error).message
    );
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return sendErrorResponse(res, 'Thiếu ID bài viết', HTTP_STATUS.BAD_REQUEST);
    }
    const post = await postService.getPostById(parseInt(id));

    if (!post) {
      return sendErrorResponse(res, 'Không tìm thấy bài viết', HTTP_STATUS.NOT_FOUND);
    }

    return sendSuccessResponse(res, post, 'Lấy thông tin bài viết thành công');
  } catch (error) {
    return sendErrorResponse(
      res,
      'Lỗi khi lấy thông tin bài viết',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      (error as Error).message
    );
  }
};

export const getPostBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    if (!slug) {
      return sendErrorResponse(res, 'Thiếu slug bài viết', HTTP_STATUS.BAD_REQUEST);
    }
    const post = await postService.getPostBySlug(slug);

    if (!post) {
      return sendErrorResponse(res, 'Không tìm thấy bài viết', HTTP_STATUS.NOT_FOUND);
    }

    return sendSuccessResponse(res, post, 'Lấy thông tin bài viết thành công');
  } catch (error) {
    return sendErrorResponse(
      res,
      'Lỗi khi lấy thông tin bài viết',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      (error as Error).message
    );
  }
};

export const createPost = async (req: Request, res: Response) => {
  try {
    const body: CreatePostRequest = req.body;
    const newPost = await postService.createPost(body);
    return sendSuccessResponse(res, newPost, 'Tạo bài viết mới thành công', HTTP_STATUS.CREATED);
  } catch (error) {
    return sendErrorResponse(
      res,
      'Lỗi khi tạo bài viết mới',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      (error as Error).message
    );
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return sendErrorResponse(res, 'Thiếu ID bài viết', HTTP_STATUS.BAD_REQUEST);
    }
    const body: UpdatePostRequest = req.body;
    const updatedPost = await postService.updatePost(parseInt(id), body);

    if (!updatedPost) {
      return sendErrorResponse(res, 'Không tìm thấy bài viết để cập nhật', HTTP_STATUS.NOT_FOUND);
    }

    return sendSuccessResponse(res, updatedPost, 'Cập nhật bài viết thành công');
  } catch (error) {
    return sendErrorResponse(
      res,
      'Lỗi khi cập nhật bài viết',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      (error as Error).message
    );
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return sendErrorResponse(res, 'Thiếu ID bài viết', HTTP_STATUS.BAD_REQUEST);
    }
    const success = await postService.deletePost(parseInt(id));

    if (!success) {
      return sendErrorResponse(res, 'Không tìm thấy bài viết để xóa', HTTP_STATUS.NOT_FOUND);
    }

    return sendSuccessResponse(res, null, 'Xóa bài viết thành công');
  } catch (error) {
    return sendErrorResponse(
      res,
      'Lỗi khi xóa bài viết',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      (error as Error).message
    );
  }
};
