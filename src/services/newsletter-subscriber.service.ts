import { Op, WhereOptions } from 'sequelize';
import { NewsletterSubscriber } from '@/models/NewsletterSubscriber';
import { 
  INewsletterSubscriber, 
  NewsletterSubscriberCreationAttributes, 
  CreateNewsletterSubscriberRequest, 
  UpdateNewsletterSubscriberRequest 
} from '@/types';

export class NewsletterSubscriberService {
  /**
   * Register a new subscriber
   */
  async subscribe(data: CreateNewsletterSubscriberRequest) {
    const { email } = data;

    // Check if email already exists
    const existing = await NewsletterSubscriber.findOne({ where: { email } });
    if (existing) {
      if (!existing.isActive) {
        // Reactivate if it was inactive
        return await existing.update({ isActive: true });
      }
      return existing;
    }

    return await NewsletterSubscriber.create({
      email,
      isActive: true
    } as NewsletterSubscriberCreationAttributes);
  }

  /**
   * Get all subscribers with search and pagination
   */
  async getAllSubscribers(query: {
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
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = query;

    const offset = (page - 1) * limit;
    const where: WhereOptions<INewsletterSubscriber> = {};

    if (search) {
      where.email = { [Op.like]: `%${search}%` };
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const { count, rows } = await NewsletterSubscriber.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sortBy, sortOrder]],
    });

    return {
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      subscribers: rows,
    };
  }

  /**
   * Update subscriber status
   */
  async updateSubscriber(id: number, data: UpdateNewsletterSubscriberRequest) {
    const subscriber = await NewsletterSubscriber.findByPk(id);
    if (!subscriber) return null;

    return await subscriber.update(data);
  }

  /**
   * Delete subscriber
   */
  async deleteSubscriber(id: number) {
    const subscriber = await NewsletterSubscriber.findByPk(id);
    if (!subscriber) return false;

    await subscriber.destroy();
    return true;
  }
}

export const newsletterSubscriberService = new NewsletterSubscriberService();
