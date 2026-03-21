import cron from 'node-cron';
import { Op } from 'sequelize';
import { Post } from '@/models/Post';
import { POST_STATUS } from '@/constants';
import { Logger } from '@/lib/logger';

/**
 * Service to handle background tasks using cron jobs
 */
export class CronService {
  /**
   * Initialize all cron jobs
   */
  public static init(): void {
    // Job to automatically publish scheduled posts
    // Runs every minute
    cron.schedule('* * * * *', async () => {
      try {
        const now = new Date();
        
        // Find all SCHEDULED posts where publishAt <= now
        const [updatedCount] = await Post.update(
          { status: POST_STATUS.PUBLISHED },
          {
            where: {
              status: POST_STATUS.SCHEDULED,
              publishAt: {
                [Op.lte]: now,
              },
            },
          }
        );

        if (updatedCount > 0) {
          Logger.info(`Cron: Automatically published ${updatedCount} scheduled posts.`);
        }
      } catch (error) {
        Logger.error(`Cron Error (Scheduled Publishing): ${error}`);
      }
    });

    Logger.info('Cron Jobs initialized successfully.');
  }
}
