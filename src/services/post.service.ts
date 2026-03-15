import { Op, WhereOptions } from 'sequelize';
import { Post } from '@/models/Post';
import { PostCreationAttributes, IPost, CreatePostRequest, UpdatePostRequest } from '@/types';
import { TranslationService } from './translation.service';

export class PostService {
  /**
   * Get all posts with search, filter and pagination
   */
  async getAllPosts(query: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }) {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = query;

    const offset = (page - 1) * limit;
    const where: WhereOptions<IPost> = {};

    // Search by title (VI, EN, ZH)
    if (search) {
      const searchPattern = `%${search}%`;
      const orConditions: WhereOptions<IPost>[] = [
        { title_vi: { [Op.like]: searchPattern } },
        { title_en: { [Op.like]: searchPattern } },
        { title_zh: { [Op.like]: searchPattern } },
      ];
      Object.assign(where, { [Op.or]: orConditions });
    }

    // Filter by status
    if (status !== undefined) {
      where.status = status;
    }

    const { count, rows } = await Post.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sortBy, sortOrder]],
    });

    return {
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      posts: rows,
    };
  }

  /**
   * Get post by ID
   */
  async getPostById(id: number) {
    return await Post.findByPk(id);
  }

  /**
   * Get post by slug
   */
  async getPostBySlug(slug: string) {
    return await Post.findOne({ where: { slug } });
  }

  /**
   * Create new post
   */
  async createPost(data: CreatePostRequest) {
    // Luôn dịch khi tạo mới nếu không có bản dịch sẵn hoặc được yêu cầu dịch
    if (data.translateTitle !== false) {
      const { en, zh } = await TranslationService.translateToAll(data.title_vi);
      data.title_en = en;
      data.title_zh = zh;
    }
    
    if (data.translateContent !== false && data.content_vi) {
      const { en, zh } = await TranslationService.translateToAll(data.content_vi);
      data.content_en = en;
      data.content_zh = zh;
    }

    // Loại bỏ các cờ trước khi lưu vào DB
    const { translateTitle, translateContent, ...rest } = data;
    void translateTitle;
    void translateContent;
    return await Post.create(rest as PostCreationAttributes);
  }

  /**
   * Update post
   */
  async updatePost(id: number, data: UpdatePostRequest) {
    const post = await Post.findByPk(id);
    if (!post) return null;

    // Xử lý dịch Tiêu đề bài viết
    if (data.translateTitle && data.title_vi) {
      // Có yêu cầu dịch mới do title_vi thay đổi
      const { en, zh } = await TranslationService.translateToAll(data.title_vi);
      data.title_en = en;
      data.title_zh = zh;
    } else if (!post.title_en || !post.title_zh) {
      // Không thay đổi title_vi, nhưng DB đang thiếu bản dịch (do trước đó lỗi hoặc tạo từ cũ)
      const textToTranslate = data.title_vi || post.title_vi;
      if (textToTranslate) {
        const { en, zh } = await TranslationService.translateToAll(textToTranslate);
        if (!post.title_en) data.title_en = en;
        if (!post.title_zh) data.title_zh = zh;
      }
    }

    // Xử lý dịch Nội dung bài viết
    if (data.translateContent && data.content_vi) {
      // Có yêu cầu dịch mới do content_vi thay đổi
      const { en, zh } = await TranslationService.translateToAll(data.content_vi);
      data.content_en = en;
      data.content_zh = zh;
    } else if (!post.content_en || !post.content_zh) {
      // Không thay đổi content_vi, nhưng DB đang thiếu bản dịch
      const textToTranslate = data.content_vi || post.content_vi;
      if (textToTranslate) {
        const { en, zh } = await TranslationService.translateToAll(textToTranslate);
        if (!post.content_en) data.content_en = en;
        if (!post.content_zh) data.content_zh = zh;
      }
    }

    const { translateTitle, translateContent, ...rest } = data;
    void translateTitle;
    void translateContent;
    return await post.update(rest);
  }

  /**
   * Delete post
   */
  async deletePost(id: number) {
    const post = await Post.findByPk(id);
    if (!post) return false;

    await post.destroy();
    return true;
  }
}

export const postService = new PostService();
