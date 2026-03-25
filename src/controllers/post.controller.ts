import { Request, Response } from 'express';
import { postService } from '@/services/post.service';
import { AIService } from '@/services/ai.service';
import { CreatePostRequest, UpdatePostRequest, AuthenticatedRequest } from '@/types';
import { sendSuccessResponse, sendErrorResponse } from '@/utils/responseFormatter';
import { HTTP_STATUS, USER_ROLES, POST_STATUS } from '@/constants';
import { uploadImage, deleteImageByUrl } from '@/utils/cloudinary';

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const isAdmin = authReq.user && authReq.user.role === USER_ROLES.ROLE_ADMIN;

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
      status: isAdmin ? (status as string) : POST_STATUS.PUBLISHED,
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'ASC' | 'DESC',
      isAdmin: !!isAdmin,
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
    const authReq = req as AuthenticatedRequest;
    const isAdmin = authReq.user && authReq.user.role === USER_ROLES.ROLE_ADMIN;

    const { slug } = req.params;
    if (!slug) {
      return sendErrorResponse(res, 'Thiếu slug bài viết', HTTP_STATUS.BAD_REQUEST);
    }
    const post = await postService.getPostBySlug(slug, !!isAdmin);

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
    
    // Handle image upload to Cloudinary if a file was provided
    if (req.file) {
      const uploadResult = await uploadImage(req.file.buffer, 'posts');
      if (uploadResult.success && uploadResult.url) {
        body.media = uploadResult.url;
      }
    }
    
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
    
    // Check if post exists for potential image management
    const existingPost = await postService.getPostById(parseInt(id));
    if (!existingPost) {
      return sendErrorResponse(res, 'Không tìm thấy bài viết để cập nhật', HTTP_STATUS.NOT_FOUND);
    }

    // Handle image upload to Cloudinary if a new file was provided
    if (req.file) {
      const uploadResult = await uploadImage(req.file.buffer, 'posts');
      if (uploadResult.success && uploadResult.url) {
        // Optionally delete the old image if it was on Cloudinary
        if (existingPost.media && existingPost.media.includes('cloudinary')) {
          await deleteImageByUrl(existingPost.media);
        }
        body.media = uploadResult.url;
      }
    }
    
    const updatedPost = await postService.updatePost(parseInt(id), body);
    
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

export const scoreSeo = async (req: Request, res: Response) => {
  try {
    const { title, slug, content } = req.body;
    
    if (!title || !content) {
      return sendErrorResponse(res, 'Tiêu đề và nội dung không được để trống khi chấm điểm SEO', HTTP_STATUS.BAD_REQUEST);
    }

    const result = await AIService.scoreSeo({ title, slug, content });
    
    return sendSuccessResponse(res, result, 'Chấm điểm SEO thành công');
  } catch (error) {
    return sendErrorResponse(
      res,
      'Lỗi khi chấm điểm SEO bài viết',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      (error as Error).message
    );
  }
};
