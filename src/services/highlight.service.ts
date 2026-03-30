import { Highlight } from '@/models/Highlight';
import { 
  IHighlight, 
  HighlightCreationAttributes, 
  CreateHighlightRequest, 
  UpdateHighlightRequest,
  HighlightListResult,
  PaginationQuery
} from '@/types';
import TranslationService from './translation.service';

class HighlightService {
  public async createHighlight(data: CreateHighlightRequest): Promise<IHighlight> {
    if (data.translateTitle && data.title_vi) {
      const { en, zh } = await TranslationService.translateToAll(data.title_vi);
      data.title_en = en;
      data.title_zh = zh;
    }

    if (data.translateContent && data.content_vi) {
      const { en, zh } = await TranslationService.translateToAll(data.content_vi);
      data.content_en = en;
      data.content_zh = zh;
    }

    // Loại bỏ cờ trước khi lưu DB
    const { translateTitle, translateContent, ...rest } = data;
    void translateTitle;
    void translateContent;

    return await Highlight.create(rest as HighlightCreationAttributes);
  }

  public async updateHighlight(id: number, data: UpdateHighlightRequest): Promise<IHighlight | null> {
    const highlight = await Highlight.findByPk(id);
    if (!highlight) return null;

    if (data.translateTitle && data.title_vi) {
      const { en, zh } = await TranslationService.translateToAll(data.title_vi);
      data.title_en = en;
      data.title_zh = zh;
    }

    if (data.translateContent && data.content_vi) {
      const { en, zh } = await TranslationService.translateToAll(data.content_vi);
      data.content_en = en;
      data.content_zh = zh;
    }

    const { translateTitle, translateContent, ...rest } = data;
    void translateTitle;
    void translateContent;

    await highlight.update(rest as Partial<HighlightCreationAttributes>);
    return highlight;
  }

  public async deleteHighlight(id: number): Promise<boolean> {
    const deletedCount = await Highlight.destroy({ where: { id } });
    return deletedCount > 0;
  }

  public async getHighlightById(id: number): Promise<IHighlight | null> {
    return await Highlight.findByPk(id);
  }

  public async getAllHighlights(query: PaginationQuery): Promise<HighlightListResult> {
    const { page = 1, limit = 10, sortBy = 'orderIndex', sortOrder = 'ASC' } = query;
    const offset = (page - 1) * limit;


    const { count, rows } = await Highlight.findAndCountAll({
      limit,
      offset,
      order: [[sortBy, sortOrder]]
    });

    return {
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      highlights: rows
    };
  }

  public async getPublicHighlights(): Promise<IHighlight[]> {
    return await Highlight.findAll({
      order: [['orderIndex', 'ASC']]
    });
  }
}

export default new HighlightService();
