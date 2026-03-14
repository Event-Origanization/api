import { Request, Response } from 'express';
import { websiteConfigService } from '@/services/website-config.service';
import { sendSuccessResponse, sendErrorResponse } from '@/utils/responseFormatter';
import { HTTP_STATUS } from '@/constants';
import { CONFIG_GROUPS } from '@/constants/config';

export const getAllConfigs = async (_req: Request, res: Response) => {
  try {
    const configs = await websiteConfigService.getAllConfigs();
    return sendSuccessResponse(res, configs, 'Lấy danh sách cấu hình thành công');
  } catch (error) {
    return sendErrorResponse(res, 'Lỗi khi lấy danh sách cấu hình', HTTP_STATUS.INTERNAL_SERVER_ERROR, (error as Error).message);
  }
};

export const getConfigsByGroup = async (req: Request, res: Response) => {
  try {
    const { group } = req.params;
    if (!group) {
      return sendErrorResponse(res, 'Thiếu thông tin nhóm cấu hình', HTTP_STATUS.BAD_REQUEST);
    }
    
    // Validate group against constants
    const upperGroup = group.toUpperCase();
    const validGroups = Object.values(CONFIG_GROUPS) as string[];
    if (!validGroups.includes(upperGroup)) {
      return sendErrorResponse(res, `Nhóm cấu hình ${group} không hợp lệ`, HTTP_STATUS.BAD_REQUEST);
    }

    const configs = await websiteConfigService.getConfigsByGroup(upperGroup);
    return sendSuccessResponse(res, configs, `Lấy cấu hình nhóm ${upperGroup} thành công`);
  } catch (error) {
    return sendErrorResponse(res, 'Lỗi khi lấy cấu hình theo nhóm', HTTP_STATUS.INTERNAL_SERVER_ERROR, (error as Error).message);
  }
};

export const updateConfig = async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    if (!key) {
      return sendErrorResponse(res, 'Thiếu key cấu hình', HTTP_STATUS.BAD_REQUEST);
    }

    // Optional: Validate if payload contains 'group' and if it's valid
    const validGroups = Object.values(CONFIG_GROUPS) as string[];
    if (req.body.group && !validGroups.includes(req.body.group.toUpperCase())) {
      return sendErrorResponse(res, `Nhóm cấu hình ${req.body.group} không hợp lệ`, HTTP_STATUS.BAD_REQUEST);
    }

    const updatedConfig = await websiteConfigService.updateConfig(key, req.body);
    
    if (!updatedConfig) {
      return sendErrorResponse(res, 'Không tìm thấy cấu hình', HTTP_STATUS.NOT_FOUND);
    }

    return sendSuccessResponse(res, updatedConfig, 'Cập nhật cấu hình thành công');
  } catch (error) {
    return sendErrorResponse(res, 'Lỗi khi cập nhật cấu hình', HTTP_STATUS.INTERNAL_SERVER_ERROR, (error as Error).message);
  }
};

export const bulkUpdateConfigs = async (req: Request, res: Response) => {
  try {
    const { configs } = req.body;
    if (!Array.isArray(configs)) {
      return sendErrorResponse(res, 'Dữ liệu không hợp lệ', HTTP_STATUS.BAD_REQUEST);
    }

    // Validate each config in bulk update if needed
    const validGroups = Object.values(CONFIG_GROUPS) as string[];
    for (const item of configs) {
       if (item.group && !validGroups.includes(item.group.toUpperCase())) {
         return sendErrorResponse(res, `Nhóm cấu hình ${item.group} cho key ${item.key} không hợp lệ`, HTTP_STATUS.BAD_REQUEST);
       }
    }

    await websiteConfigService.bulkUpdateConfigs(configs);
    return sendSuccessResponse(res, null, 'Cập nhật hàng loạt thành công');
  } catch (error) {
    return sendErrorResponse(res, 'Lỗi khi cập nhật hàng loạt cấu hình', HTTP_STATUS.INTERNAL_SERVER_ERROR, (error as Error).message);
  }
};
