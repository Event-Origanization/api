import { Op, WhereOptions } from "sequelize";
import { Product } from "@/models/Product";
import {
  ProductCreationAttributes,
  IProduct,
  CreateProductRequest,
  UpdateProductRequest,
} from "@/types";
import { TranslationService } from "./translation.service";
import { PAGE_KEYS } from "@/constants/seo";

export class ProductService {
  /**
   * Get all products with search, filter and pagination
   */
  async getAllProducts(query: {
    page?: number;
    limit?: number;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    isActive?: boolean;
    productType?: typeof PAGE_KEYS.SOUND_LIGHT | typeof PAGE_KEYS.RENTAL;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
  }) {
    const {
      page = 1,
      limit = 10,
      search,
      minPrice,
      maxPrice,
      isActive,
      productType,
      sortBy = "created_at", // Use actual DB column name, not alias
      sortOrder = "DESC",
    } = query;

    const offset = (page - 1) * limit;
    const where: WhereOptions<IProduct> = {};

    // Search by name (VI, EN, ZH)
    if (search) {
      const searchPattern = `%${search}%`;
      const orConditions: WhereOptions<IProduct>[] = [
        { name_vi: { [Op.like]: searchPattern } },
        { name_en: { [Op.like]: searchPattern } },
        { name_zh: { [Op.like]: searchPattern } },
      ];
      Object.assign(where, { [Op.or]: orConditions });
    }

    // Filter by price
    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceCondition: { [Op.gte]?: number; [Op.lte]?: number } = {};
      if (minPrice !== undefined) priceCondition[Op.gte] = minPrice;
      if (maxPrice !== undefined) priceCondition[Op.lte] = maxPrice;
      where.price = priceCondition;
    }

    // Filter by active status
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    // Filter by product type
    if (productType !== undefined) {
      where.productType = productType;
    }

    // Run count and data queries separately to minimize memory usage
    const count = await Product.count({ where });

    const rows = await Product.findAll({
      where,
      limit,
      offset,
      order: [[sortBy, sortOrder]],
    });

    return {
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      products: rows,
    };
  }

  /**
   * Get product by ID
   */
  async getProductById(id: number) {
    return await Product.findByPk(id);
  }

  /**
   * Get product by slug
   */
  async getProductBySlug(slug: string) {
    return await Product.findOne({ where: { slug } });
  }

  /**
   * Create new product
   */
  async createProduct(data: CreateProductRequest) {
    // Luôn dịch khi tạo mới nếu không có bản dịch sẵn hoặc được yêu cầu dịch
    if (data.translateName !== false) {
      const { en, zh } = await TranslationService.translateToAll(data.name_vi);
      data.name_en = en;
      data.name_zh = zh;
    }

    if (data.translateContent !== false && data.content_vi) {
      const { en, zh } = await TranslationService.translateToAll(
        data.content_vi,
      );
      data.content_en = en;
      data.content_zh = zh;
    }

    // Loại bỏ các cờ trước khi lưu vào DB
    const { translateName, translateContent, ...rest } = data;
    void translateName;
    void translateContent;
    return await Product.create(rest as ProductCreationAttributes);
  }

  /**
   * Update product
   */
  async updateProduct(id: number, data: UpdateProductRequest) {
    const product = await Product.findByPk(id);
    if (!product) return null;

    // Xử lý dịch Tên sản phẩm
    if (data.translateName && data.name_vi) {
      // Có yêu cầu dịch mới do name_vi thay đổi
      const { en, zh } = await TranslationService.translateToAll(data.name_vi);
      data.name_en = en;
      data.name_zh = zh;
    } else if (!product.name_en || !product.name_zh) {
      // Không thay đổi name_vi, nhưng DB đang thiếu bản dịch (do trước đó lỗi hoặc tạo từ cũ)
      const textToTranslate = data.name_vi || product.name_vi;
      if (textToTranslate) {
        const { en, zh } =
          await TranslationService.translateToAll(textToTranslate);
        if (!product.name_en) data.name_en = en;
        if (!product.name_zh) data.name_zh = zh;
      }
    }

    // Xử lý dịch Nội dung sản phẩm
    if (data.translateContent && data.content_vi) {
      // Có yêu cầu dịch mới do content_vi thay đổi
      const { en, zh } = await TranslationService.translateToAll(
        data.content_vi,
      );
      data.content_en = en;
      data.content_zh = zh;
    } else if (!product.content_en || !product.content_zh) {
      // Không thay đổi content_vi, nhưng DB đang thiếu bản dịch
      const textToTranslate = data.content_vi || product.content_vi;
      if (textToTranslate) {
        const { en, zh } =
          await TranslationService.translateToAll(textToTranslate);
        if (!product.content_en) data.content_en = en;
        if (!product.content_zh) data.content_zh = zh;
      }
    }

    const { translateName, translateContent, ...rest } = data;
    void translateName;
    void translateContent;
    return await product.update(rest);
  }

  /**
   * Delete product
   */
  async deleteProduct(id: number) {
    const product = await Product.findByPk(id);
    if (!product) return false;

    await product.destroy();
    return true;
  }
}

export const productService = new ProductService();
