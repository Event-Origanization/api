import { Op, WhereOptions } from 'sequelize';
import { Post } from '@/models/Post';
import { PostCreationAttributes, IPost, CreatePostRequest, UpdatePostRequest } from '@/types';
import { TranslationService } from './translation.service';
import { sanitizeSearch } from '@/utils/helpers';
import { Logger } from '@/lib';

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
    isAdmin?: boolean;
  }) {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      isAdmin = false,
    } = query;

    const offset = (page - 1) * limit;
    const where: WhereOptions<IPost> = {};

    // Search by title (VI, EN, ZH) using Full-Text Search
    if (search) {
      const sanitizedSearch = sanitizeSearch(search);
      if (Post.sequelize) {
        const matchLiteral = Post.sequelize.literal(
          `MATCH(title_vi, title_en, title_zh) AGAINST(${Post.sequelize.escape(sanitizedSearch)} IN NATURAL LANGUAGE MODE)`
        );
        Object.assign(where, { [Op.and]: [matchLiteral] });
      }
    }

    // Filter by status
    if (status !== undefined) {
      where.status = status;
    }

    // Public users can only see published posts that are not scheduled for future
    if (!isAdmin) {
      where.status = 'PUBLISHED';
      Object.assign(where, {
        [Op.or]: [
          { publishAt: null },
          { publishAt: { [Op.lte]: new Date() } },
        ],
      });
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
  async getPostById(id: number, isAdmin: boolean = false) {
    const where: WhereOptions<IPost> = { id };

    if (!isAdmin) {
      where.status = 'PUBLISHED';
      Object.assign(where, {
        [Op.or]: [
          { publishAt: null },
          { publishAt: { [Op.lte]: new Date() } },
        ],
      });
    }

    return await Post.findOne({ where });
  }

  /**
   * Get post by slug
   */
  async getPostBySlug(slug: string, isAdmin: boolean = false) {
    const where: WhereOptions<IPost> = { slug };

    if (!isAdmin) {
      where.status = 'PUBLISHED';
      Object.assign(where, {
        [Op.or]: [
          { publishAt: null },
          { publishAt: { [Op.lte]: new Date() } },
        ],
      });
    }

    return await Post.findOne({ where });
  }

  /**
   * Create new post
   */
  async createPost(data: CreatePostRequest) {
    Logger.info(`Bắt đầu tạo bài viết mới: ${data.title_vi}`);
    
    // Kiểm tra slug duy nhất
    const existingSlug = await Post.findOne({ where: { slug: data.slug } });
    if (existingSlug) {
      Logger.error(`Tạo bài viết thất bại: Slug "${data.slug}" đã tồn tại (ID: ${existingSlug.id})`);
      throw new Error(`Slug "${data.slug}" đã tồn tại. Vui lòng chọn slug khác.`);
    }

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

    // Loại bỏ các cờ và trường hệ thống trước khi lưu vào DB
    const { 
      translateTitle, 
      translateContent, 
      id: _id, 
      createdAt: _ca, 
      updatedAt: _ua, 
      ...rest 
    } = data as any;

    void translateTitle;
    void translateContent;
    void _id;
    void _ca;
    void _ua;

    const newPost = await Post.create(rest as PostCreationAttributes);
    Logger.info(`Tạo bài viết mới thành công (ID: ${newPost.id})`);
    return newPost;
  }

  /**
   * Update post
   */
  async updatePost(id: number, data: UpdatePostRequest) {
    Logger.info(`Bắt đầu cập nhật bài viết ID: ${id}`);
    const post = await Post.findByPk(id);
    if (!post) {
      Logger.warn(`Không tìm thấy bài viết ID: ${id} để cập nhật`);
      return null;
    }

    // Kiểm tra slug nếu có thay đổi
    if (data.slug && data.slug !== post.slug) {
      const existingSlug = await Post.findOne({
        where: {
          slug: data.slug,
          id: { [Op.ne]: id }
        }
      });
      if (existingSlug) {
        Logger.error(`Cập nhật thất bại: Slug "${data.slug}" đã tồn tại ở bài viết khác (ID: ${existingSlug.id})`);
        throw new Error(`Slug "${data.slug}" đã tồn tại. Vui lòng chọn slug khác.`);
      }
    }

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

    // Loại bỏ các trường hệ thống và cờ trước khi cập nhật
    const { 
      translateTitle, 
      translateContent, 
      id: _id, 
      createdAt: _ca, 
      updatedAt: _ua, 
      ...rest 
    } = data as any;
    
    void translateTitle;
    void translateContent;
    void _id;
    void _ca;
    void _ua;

    const dataUpdate = await post.update(rest);
    Logger.info(`Cập nhật bài viết ID: ${id} thành công`);
    return dataUpdate;
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
