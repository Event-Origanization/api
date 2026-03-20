import { Op, WhereOptions } from 'sequelize';
import { ContactMessage } from '@/models/ContactMessage';
import {
  IContactMessage,
  ContactMessageCreationAttributes,
  CreateContactMessageRequest,
  UpdateContactMessageRequest,
  ContactMessageQueryOptions,
  ContactMessageListResult,
} from '@/types';

export class ContactMessageService {
  /**
   * Lấy danh sách tin nhắn liên hệ có phân trang và tìm kiếm
   */
  async getAllContactMessages(query: ContactMessageQueryOptions): Promise<ContactMessageListResult> {
    const {
      page = 1,
      limit = 20,
      search,
      isRead,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = query;

    const offset = (page - 1) * limit;
    const where: WhereOptions<IContactMessage> = {};

    if (search) {
      const searchPattern = `%${search}%`;
      Object.assign(where, {
        [Op.or]: [
          { name: { [Op.like]: searchPattern } },
          { email: { [Op.like]: searchPattern } },
          { phone: { [Op.like]: searchPattern } }
        ],
      });
    }

    if (isRead !== undefined) {
      where.isRead = isRead;
    }

    const { count, rows } = await ContactMessage.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sortBy, sortOrder]],
    });

    return {
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      contactMessages: rows as unknown as IContactMessage[],
    };
  }

  /**
   * Lấy tin nhắn theo ID
   */
  async getContactMessageById(id: number): Promise<ContactMessage | null> {
    return await ContactMessage.findByPk(id);
  }

  /**
   * Tạo tin nhắn mới
   */
  async createContactMessage(data: CreateContactMessageRequest): Promise<ContactMessage> {
    const attrs: ContactMessageCreationAttributes = {
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      message: data.message,
    };
    return await ContactMessage.create(attrs);
  }

  /**
   * Cập nhật trạng thái đã đọc của tin nhắn
   */
  async markAsRead(id: number, data: UpdateContactMessageRequest): Promise<ContactMessage | null> {
    const contactMessage = await ContactMessage.findByPk(id);
    if (!contactMessage) return null;
    return await contactMessage.update({ isRead: data.isRead });
  }

  /**
   * Xóa tin nhắn
   */
  async deleteContactMessage(id: number): Promise<boolean> {
    const contactMessage = await ContactMessage.findByPk(id);
    if (!contactMessage) return false;
    await contactMessage.destroy();
    return true;
  }
}

export const contactMessageService = new ContactMessageService();
