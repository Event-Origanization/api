import { WebsiteConfig } from '@/models/WebsiteConfig';
import { IWebsiteConfig, WebsiteConfigCreationAttributes } from '@/types';

export class WebsiteConfigService {
  async getAllConfigs(): Promise<WebsiteConfig[]> {
    return await WebsiteConfig.findAll({
      order: [['group', 'ASC'], ['key', 'ASC']]
    });
  }

  async getConfigsByGroup(group: string): Promise<WebsiteConfig[]> {
    return await WebsiteConfig.findAll({
      where: { group },
      order: [['key', 'ASC']]
    });
  }

  async updateConfig(key: string, data: Partial<IWebsiteConfig>): Promise<WebsiteConfig | null> {
    const config = await WebsiteConfig.findOne({ where: { key } });
    if (!config) return null;

    return await config.update(data);
  }

  async bulkUpdateConfigs(configs: { key: string; value_vi?: string; value_en?: string; value_zh?: string }[]): Promise<void> {
    for (const item of configs) {
      await WebsiteConfig.update(
        { 
          value_vi: item.value_vi, 
          value_en: item.value_en, 
          value_zh: item.value_zh 
        },
        { where: { key: item.key } }
      );
    }
  }

  async findOrCreateConfig(data: WebsiteConfigCreationAttributes): Promise<WebsiteConfig> {
    const [config] = await WebsiteConfig.findOrCreate({
      where: { key: data.key },
      defaults: data
    });
    return config;
  }
}

export const websiteConfigService = new WebsiteConfigService();
