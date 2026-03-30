import { Request, Response } from 'express';
import { productService } from '@/services/product.service';
import { CreateProductRequest, UpdateProductRequest } from '@/types';
import { sendSuccessResponse, sendErrorResponse } from '@/utils/responseFormatter';
import { PAGE_KEYS } from '@/constants/seo';
import { HTTP_STATUS } from '@/constants';
import { uploadImage, deleteImageByUrl } from '@/utils/cloudinary';

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const {
      page,
      limit,
      search,
      minPrice,
      maxPrice,
      isActive,
      productType,
      sortBy,
      sortOrder,
    } = req.query;

    const result = await productService.getAllProducts({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      search: search as string,
      minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
      productType: productType as typeof PAGE_KEYS.SOUND_LIGHT | typeof PAGE_KEYS.RENTAL,
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'ASC' | 'DESC',
    });

    return sendSuccessResponse(res, result, 'Lấy danh sách sản phẩm thành công');
  } catch (error) {
    return sendErrorResponse(
      res,
      'Lỗi khi lấy danh sách sản phẩm',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      (error as Error).message
    );
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return sendErrorResponse(res, 'Thiếu ID sản phẩm', HTTP_STATUS.BAD_REQUEST);
    }
    const product = await productService.getProductById(parseInt(id));

    if (!product) {
      return sendErrorResponse(res, 'Không tìm thấy sản phẩm', HTTP_STATUS.NOT_FOUND);
    }

    return sendSuccessResponse(res, product, 'Lấy thông tin sản phẩm thành công');
  } catch (error) {
    return sendErrorResponse(
      res,
      'Lỗi khi lấy thông tin sản phẩm',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      (error as Error).message
    );
  }
};

export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    if (!slug) {
      return sendErrorResponse(res, 'Thiếu slug sản phẩm', HTTP_STATUS.BAD_REQUEST);
    }
    const product = await productService.getProductBySlug(slug);

    if (!product) {
      return sendErrorResponse(res, 'Không tìm thấy sản phẩm', HTTP_STATUS.NOT_FOUND);
    }

    return sendSuccessResponse(res, product, 'Lấy thông tin sản phẩm thành công');
  } catch (error) {
    return sendErrorResponse(
      res,
      'Lỗi khi lấy thông tin sản phẩm',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      (error as Error).message
    );
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const body: CreateProductRequest = req.body;
    
    // Handle multiple image uploads to Cloudinary
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const uploadedUrls: string[] = [];
      for (const file of req.files) {
        const uploadResult = await uploadImage(file.buffer, 'products');
        if (uploadResult.success && uploadResult.url) {
          uploadedUrls.push(uploadResult.url);
        }
      }
      body.images = uploadedUrls;
    }
    
    const newProduct = await productService.createProduct(body);
    return sendSuccessResponse(res, newProduct, 'Tạo sản phẩm mới thành công', HTTP_STATUS.CREATED);
  } catch (error) {
    return sendErrorResponse(
      res,
      'Lỗi khi tạo sản phẩm mới',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      (error as Error).message
    );
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return sendErrorResponse(res, 'Thiếu ID sản phẩm', HTTP_STATUS.BAD_REQUEST);
    }
    const body: UpdateProductRequest = req.body;
    
    // Check if product exists first for potential image management
    const existingProduct = await productService.getProductById(parseInt(id));
    if (!existingProduct) {
      return sendErrorResponse(res, 'Không tìm thấy sản phẩm để cập nhật', HTTP_STATUS.NOT_FOUND);
    }

    // Parse existing images if passed as a string/array from frontend
    let currentImages: string[] = [];
    if (body.images) {
      if (typeof body.images === 'string') {
        try {
          currentImages = JSON.parse(body.images);
        } catch {
          currentImages = [body.images];
        }
      } else if (Array.isArray(body.images)) {
        currentImages = [...body.images];
      }
    } else {
      currentImages = existingProduct.images || [];
    }
    
    // Find old images that were removed in the new request
    if (existingProduct.images && existingProduct.images.length > 0) {
      const removedImages = existingProduct.images.filter(img => !currentImages.includes(img));
      for (const img of removedImages) {
        if (img && img.includes('cloudinary')) {
          await deleteImageByUrl(img);
        }
      }
    }

    // Handle new images upload via req.files
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      for (const file of req.files) {
        const uploadResult = await uploadImage(file.buffer, 'products');
        if (uploadResult.success && uploadResult.url) {
          currentImages.push(uploadResult.url);
        }
      }
    }
    // Update body.images to final array
    body.images = currentImages;
    
    const updatedProduct = await productService.updateProduct(parseInt(id), body);
    
    return sendSuccessResponse(res, updatedProduct, 'Cập nhật sản phẩm thành công');
  } catch (error) {
    return sendErrorResponse(
      res,
      'Lỗi khi cập nhật sản phẩm',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      (error as Error).message
    );
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return sendErrorResponse(res, 'Thiếu ID sản phẩm', HTTP_STATUS.BAD_REQUEST);
    }
    const success = await productService.deleteProduct(parseInt(id));

    if (!success) {
      return sendErrorResponse(res, 'Không tìm thấy sản phẩm để xóa', HTTP_STATUS.NOT_FOUND);
    }

    return sendSuccessResponse(res, null, 'Xóa sản phẩm thành công');
  } catch (error) {
    return sendErrorResponse(
      res,
      'Lỗi khi xóa sản phẩm',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      (error as Error).message
    );
  }
};
