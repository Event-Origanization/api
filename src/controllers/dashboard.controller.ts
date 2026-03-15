import { Request, Response } from 'express';
import { dashboardService } from '@/services/dashboard.service';
import { sendSuccessResponse, sendErrorResponse } from '@/utils/responseFormatter';
import { HTTP_STATUS } from '@/constants';

export const getOverview = async (_req: Request, res: Response) => {
  try {
    const data = await dashboardService.getOverviewData();
    return sendSuccessResponse(res, data, 'Lấy dữ liệu tổng quan thành công');
  } catch (error) {
    return sendErrorResponse(
      res,
      'Lỗi khi lấy dữ liệu tổng quan',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      (error as Error).message
    );
  }
};

export const getYearlyCharts = async (_req: Request, res: Response) => {
  try {
    const data = await dashboardService.getYearlyChartData();
    return sendSuccessResponse(res, data, 'Lấy dữ liệu biểu đồ hàng năm thành công');
  } catch (error) {
    return sendErrorResponse(
      res,
      'Lỗi khi lấy dữ liệu biểu đồ',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      (error as Error).message
    );
  }
};
