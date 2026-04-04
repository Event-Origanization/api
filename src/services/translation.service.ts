import axios from 'axios';
import logger from '@/lib/logger';
import { ENV } from '@/lib/env';

/**
 * Service to handle automatic translation using Google Translate API (Free/Public endpoint)
 * Note: For production use, it's recommended to use Google Cloud Translation API with an API Key.
 */

type GoogleTranslateSegment = [string, string, ...unknown[]];
type GoogleTranslateResponse = [GoogleTranslateSegment[], ...unknown[]];

export class TranslationService {
  /**
   * Translates text from one language to another
   * @param text The text to translate
   * @param targetLang Target language code (e.g., 'en', 'zh-CN')
   * @param sourceLang Source language code (default: 'vi')
   */
  public static async translate(text: string, targetLang: string, sourceLang: string = 'vi'): Promise<string> {
    if (!text || text.trim() === '') return '';

    try {
      // Using a publicly available Google Translate endpoint (unofficial)
      // This is for demonstration; for heavy use, replace with Google Cloud Translation API
      const url = `${ENV.GOOGLE_TRANSLATE_URL}?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t`;
      
      const params = new URLSearchParams();
      params.append('q', text);

      const response = await axios.post<GoogleTranslateResponse>(url, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      const data = response.data;
      
      if (data && data[0]) {
        return data[0].map((item: GoogleTranslateSegment) => item[0]).join('');
      }
      
      return text;
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error('Translation error:', error.message);
      } else {
        logger.error('Translation error: Unknown error');
      }
      return text; // Return original text on failure
    }
  }

  /**
   * Helper to translate content to all required languages (English and Chinese)
   */
  public static async translateToAll(text: string, sourceLang: string = 'vi'): Promise<{ en: string, zh: string }> {
    try {
      const [en, zh] = await Promise.all([
        this.translate(text, 'en', sourceLang),
        this.translate(text, 'zh-CN', sourceLang)
      ]);

      return { en, zh };
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error('Bulk translation error:', error.message);
      } else {
        logger.error('Bulk translation error: Unknown error');
      }
      return { en: text, zh: text };
    }
  }
}

export default TranslationService;
