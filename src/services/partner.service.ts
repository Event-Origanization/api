import { Op, WhereOptions } from 'sequelize';
import { Partner } from '@/models/Partner';
import {
  IPartner,
  PartnerCreationAttributes,
  CreatePartnerRequest,
  UpdatePartnerRequest,
  PartnerQueryOptions,
  PartnerListResult,
} from '@/types';
import { Logger } from '@/lib';

export class PartnerService {
  /**
   * Lấy danh sách Partner có phân trang và tìm kiếm
   */
  async getAllPartners(query: PartnerQueryOptions): Promise<PartnerListResult> {
    const {
      page = 1,
      limit = 20,
      search,
      isActive,
      sortBy = 'orderIndex',
      sortOrder = 'ASC',
    } = query;

    const offset = (page - 1) * limit;
    const where: WhereOptions<IPartner> = {};

    if (search) {
      const searchPattern = `%${search}%`;
      Object.assign(where, {
        [Op.or]: [{ name: { [Op.like]: searchPattern } }],
      });
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const { count, rows } = await Partner.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sortBy, sortOrder]],
      attributes: ['id', 'name', 'logo', 'orderIndex', 'isActive', 'createdAt', 'updatedAt'],
    });

    return {
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      partners: rows as unknown as IPartner[],
    };
  }

  /**
   * Lấy tất cả partner đang active (cho trang công khai)
   */
  async getActivePartners(): Promise<IPartner[]> {
    const rows = await Partner.findAll({
      where: { isActive: true },
      order: [['orderIndex', 'ASC']],
      attributes: ['id', 'name', 'logo', 'orderIndex'],
    });
    return rows as unknown as IPartner[];
  }

  /**
   * Lấy Partner theo ID
   */
  async getPartnerById(id: number): Promise<Partner | null> {
    return await Partner.findByPk(id);
  }

  /**
   * Tạo Partner mới
   */
  async createPartner(data: CreatePartnerRequest): Promise<Partner> {
    Logger.info(`Bắt đầu tạo Partner mới: ${data.name}`);
    const attrs: PartnerCreationAttributes = {
      name: data.name,
      logo: data.logo ?? null,
      orderIndex: data.orderIndex ?? 0,
      isActive: data.isActive ?? true,
    };
    const newPartner = await Partner.create(attrs);
    Logger.info(`Tạo Partner mới thành công (ID: ${newPartner.id})`);
    return newPartner;
  }

  /**
   * Cập nhật Partner
   */
  async updatePartner(id: number, data: UpdatePartnerRequest): Promise<Partner | null> {
    Logger.info(`Bắt đầu cập nhật Partner ID: ${id}`);
    const partner = await Partner.findByPk(id);
    if (!partner) {
      Logger.warn(`Không tìm thấy Partner ID: ${id} để cập nhật`);
      return null;
    }

    // Loại bỏ các trường hệ thống trước khi cập nhật
    const { ...rest } = data as UpdatePartnerRequest & { id?: number; createdAt?: Date; updatedAt?: Date };
    
    const finalUpdate = { ...rest };
    delete (finalUpdate as { id?: number }).id;
    delete (finalUpdate as { createdAt?: Date }).createdAt;
    delete (finalUpdate as { updatedAt?: Date }).updatedAt;

    const updatedPartner = await partner.update(finalUpdate);
    Logger.info(`Cập nhật Partner ID: ${id} thành công`);
    return updatedPartner;
  }

  /**
   * Xóa Partner
   */
  async deletePartner(id: number): Promise<boolean> {
    const partner = await Partner.findByPk(id);
    if (!partner) return false;
    await partner.destroy();
    return true;
  }
}

export const partnerService = new PartnerService();
