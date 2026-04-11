import { Op, WhereOptions } from "sequelize";
import { Product } from "@/models/Product";
import {
  ProductCreationAttributes,
  IProduct,
  CreateProductRequest,
  UpdateProductRequest,
} from "@/types";
import { TranslationService } from "./translation.service";
import { PAGE_KEYS, ProductCategory, CATEGORIES_BY_TYPE } from "@/constants/seo";
import { sanitizeSearch } from "@/utils/helpers";
import { Logger } from "@/lib";

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
    category?: ProductCategory | ProductCategory[];
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
      category,
      sortBy = "created_at", // Use actual DB column name, not alias
      sortOrder = "DESC",
    } = query;

    const offset = (page - 1) * limit;
    const where: WhereOptions<IProduct> = {};

    // Search by name (VI, EN, ZH) using Full-Text Search
    if (search) {
      const sanitizedSearch = sanitizeSearch(search);
      if (Product.sequelize) {
        const matchLiteral = Product.sequelize.literal(
          `MATCH(name_vi, name_en, name_zh) AGAINST(${Product.sequelize.escape(sanitizedSearch)} IN NATURAL LANGUAGE MODE)`
        );
        Object.assign(where, { [Op.and]: [matchLiteral] });
      }
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

    // Filter by category
    if (category !== undefined) {
      if (Array.isArray(category)) {
        where.category = { [Op.in]: category };
      } else {
        where.category = category;
      }
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
    Logger.info(`Bắt đầu tạo sản phẩm mới: ${data.name_vi}`);

    // Kiểm tra slug duy nhất
    const existingSlug = await Product.findOne({ where: { slug: data.slug } });
    if (existingSlug) {
      Logger.error(`Tạo sản phẩm thất bại: Slug "${data.slug}" đã tồn tại (ID: ${existingSlug.id})`);
      throw new Error(`Slug "${data.slug}" đã tồn tại. Vui lòng chọn slug khác.`);
    }

    // Luôn dịch khi tạo mới nếu không có bản dịch sẵn hoặc được yêu cầu dịch
    if (data.translateName !== false) {
      const { en, zh } = await TranslationService.translateToAll(data.name_vi);
      data.name_en = en;
      data.name_zh = zh;
    }

    // Validate category based on productType
    if (data.category && data.productType) {
      const allowedCategories = CATEGORIES_BY_TYPE[data.productType];
      if (!allowedCategories || !(allowedCategories as readonly ProductCategory[]).includes(data.category)) {
        Logger.error(`Tạo sản phẩm thất bại: Category ${data.category} không hợp lệ cho loại sản phẩm ${data.productType}`);
        throw new Error(`Category ${data.category} is not valid for product type ${data.productType}`);
      }
    }

    // Loại bỏ cờ và các trường hệ thống trước khi lưu DB
    const { 
      translateName, 
      ...rest 
    } = data as CreateProductRequest & { id?: number; createdAt?: Date; updatedAt?: Date };
    
    // Explicitly remove system fields if they were passed in literal object
    const finalData = { ...rest };
    delete (finalData as { id?: number }).id;
    delete (finalData as { createdAt?: Date }).createdAt;
    delete (finalData as { updatedAt?: Date }).updatedAt;

    void translateName;

    const newProduct = await Product.create(finalData as ProductCreationAttributes);
    Logger.info(`Tạo sản phẩm mới thành công (ID: ${newProduct.id})`);
    return newProduct;
  }

  /**
   * Update product
   */
  async updateProduct(id: number, data: UpdateProductRequest) {
    Logger.info(`Bắt đầu cập nhật sản phẩm ID: ${id}`);
    const product = await Product.findByPk(id);
    if (!product) {
      Logger.warn(`Không tìm thấy sản phẩm ID: ${id} để cập nhật`);
      return null;
    }

    // Kiểm tra slug nếu có thay đổi
    if (data.slug && data.slug !== product.slug) {
      const existingSlug = await Product.findOne({
        where: {
          slug: data.slug,
          id: { [Op.ne]: id }
        }
      });
      if (existingSlug) {
        Logger.error(`Cập nhật thất bại: Slug "${data.slug}" đã tồn tại ở sản phẩm khác (ID: ${existingSlug.id})`);
        throw new Error(`Slug "${data.slug}" đã tồn tại. Vui lòng chọn slug khác.`);
      }
    }

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

    // Validate category based on productType
    const finalProductType = data.productType || product.productType;
    const finalCategory = data.category !== undefined ? data.category : product.category;
    
    if (finalCategory && finalProductType) {
      const allowedCategories = CATEGORIES_BY_TYPE[finalProductType];
      if (!allowedCategories || !(allowedCategories as readonly ProductCategory[]).includes(finalCategory)) {
        Logger.error(`Cập nhật thất bại: Category ${finalCategory} không hợp lệ cho loại sản phẩm ${finalProductType}`);
        throw new Error(`Category ${finalCategory} is not valid for product type ${finalProductType}`);
      }
    }

    // Loại bỏ các trường hệ thống và cờ trước khi cập nhật
    const { 
      translateName, 
      ...rest 
    } = data as UpdateProductRequest & { id?: number; createdAt?: Date; updatedAt?: Date };
    
    const finalUpdate = { ...rest };
    delete (finalUpdate as { id?: number }).id;
    delete (finalUpdate as { createdAt?: Date }).createdAt;
    delete (finalUpdate as { updatedAt?: Date }).updatedAt;

    void translateName;

    const dataUpdate = await product.update(finalUpdate as ProductCreationAttributes);
    Logger.info(`Cập nhật sản phẩm ID: ${id} thành công`);
    return dataUpdate;
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
