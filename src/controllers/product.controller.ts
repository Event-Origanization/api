import { Request, Response } from 'express';
import { productService } from '@/services/product.service';
import { CreateProductRequest, UpdateProductRequest } from '@/types';
import { sendSuccessResponse, sendErrorResponse } from '@/utils/responseFormatter';
import { PAGE_KEYS } from '@/constants/seo';
import { HTTP_STATUS } from '@/constants';

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
    const updatedProduct = await productService.updateProduct(parseInt(id), body);

    if (!updatedProduct) {
      return sendErrorResponse(res, 'Không tìm thấy sản phẩm để cập nhật', HTTP_STATUS.NOT_FOUND);
    }

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
