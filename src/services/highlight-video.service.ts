import { Op, WhereOptions } from 'sequelize';
import { HighlightVideo } from '@/models/HighlightVideo';
import { HighlightVideoCreationAttributes, IHighlightVideo, CreateHighlightVideoRequest, UpdateHighlightVideoRequest } from '@/types';
import { TranslationService } from './translation.service';

export class HighlightVideoService {
  /**
   * Get all highlight videos with search and pagination
   */
  async getAllHighlightVideos(query: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }) {
    const {
      page = 1,
      limit = 10,
      search,
      isActive,
      sortBy = 'orderIndex',
      sortOrder = 'ASC',
    } = query;

    const offset = (page - 1) * limit;
    const where: WhereOptions<IHighlightVideo> = {};

    // Search by title (VI, EN, ZH)
    if (search) {
      const searchPattern = `%${search}%`;
      const orConditions: WhereOptions<IHighlightVideo>[] = [
        { title_vi: { [Op.like]: searchPattern } },
        { title_en: { [Op.like]: searchPattern } },
        { title_zh: { [Op.like]: searchPattern } },
      ];
      Object.assign(where, { [Op.or]: orConditions });
    }

    // Filter by active status
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const { count, rows } = await HighlightVideo.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sortBy, sortOrder]],
    });

    return {
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      videos: rows,
    };
  }

  /**
   * Get highlight video by ID
   */
  async getHighlightVideoById(id: number) {
    return await HighlightVideo.findByPk(id);
  }

  /**
   * Create new highlight video
   */
  async createHighlightVideo(data: CreateHighlightVideoRequest) {
    // Luôn dịch khi tạo mới nếu không có bản dịch sẵn hoặc được yêu cầu dịch
    if (data.translateTitle !== false) {
      const { en, zh } = await TranslationService.translateToAll(data.title_vi);
      data.title_en = en;
      data.title_zh = zh;
    }

    // Loại bỏ các cờ trước khi lưu vào DB
    const { translateTitle, ...rest } = data;
    return await HighlightVideo.create(rest as HighlightVideoCreationAttributes);
  }

  /**
   * Update highlight video
   */
  async updateHighlightVideo(id: number, data: UpdateHighlightVideoRequest) {
    const video = await HighlightVideo.findByPk(id);
    if (!video) return null;

    // Xử lý dịch Tiêu đề
    if (data.translateTitle && data.title_vi) {
      const { en, zh } = await TranslationService.translateToAll(data.title_vi);
      data.title_en = en;
      data.title_zh = zh;
    } else if (data.title_vi && (!video.title_en || !video.title_zh)) {
        // Có title_vi mới nhưng không yêu cầu dịch, kiểm tra xem DB có thiếu không
        const { en, zh } = await TranslationService.translateToAll(data.title_vi);
        if (!video.title_en) data.title_en = en;
        if (!video.title_zh) data.title_zh = zh;
    }

    const { translateTitle, ...rest } = data;
    return await video.update(rest);
  }

  /**
   * Delete highlight video
   */
  async deleteHighlightVideo(id: number) {
    const video = await HighlightVideo.findByPk(id);
    if (!video) return false;

    await video.destroy();
    return true;
  }
}

export const highlightVideoService = new HighlightVideoService();
