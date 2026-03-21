import { GoogleGenerativeAI } from '@google/generative-ai';
import { ENV } from '@/lib/env';
import { Logger } from '@/lib';

export interface SeoScoreResponse {
  score: number;
  analysis: string;
  suggestions: string;
}

export class AIService {
  private static genAI: GoogleGenerativeAI | null = null;

  private static getClient(): GoogleGenerativeAI {
    if (!this.genAI) {
      if (!ENV.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is not configured in .env');
      }
      this.genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);
    }
    return this.genAI;
  }

  /**
   * Strip HTML tags and simplify content for SEO analysis
   */
  private static prepareContent(content: string): string {
    // Basic HTML tag removal
    let text = content.replace(/<[^>]*>/g, ' ');
    // Remove extra spaces
    text = text.replace(/\s+/g, ' ').trim();
    // Truncate to avoid token limits (approx 2000 words)
    return text.split(' ').slice(0, 2000).join(' ');
  }

  /**
   * Score SEO for a post using Gemini AI
   */
  public static async scoreSeo(data: {
    title: string;
    slug: string;
    content: string;
  }): Promise<SeoScoreResponse> {
    try {
      const client = this.getClient();
      const model = client.getGenerativeModel({ 
        model: ENV.GEMINI_MODEL || 'gemini-2.5-flash-lite',
        generationConfig: {
          responseMimeType: "application/json",
        }
      });

      const cleanContent = this.prepareContent(data.content);

      const prompt = `
        Bạn là một chuyên gia SEO hàng đầu (SEO Specialist). Hãy phân tích dữ liệu bài viết dưới đây và đưa ra kết quả gồm 3 phần:
        1. Điểm số SEO (từ 0 đến 100).
        2. Phần Đánh giá: Nhận xét tổng quan về độ chuẩn SEO hiện tại (tiêu đề, slug, nội dung).
        3. Phần Gợi ý: Các hành động cụ thể cần làm để cải thiện (thêm từ khóa, chỉnh Title/Slug, cấu trúc thẻ H1-H3...).

        DỮ LIỆU:
        - Tiêu đề (Title): ${data.title}
        - Đường dẫn (Slug): ${data.slug}
        - Nội dung (Content): ${cleanContent}

        YÊU CẦU ĐẦU RA (Bắt buộc trả về JSON format duy nhất, không thêm text bên ngoài):
        {
          "score": number,
          "analysis": "string (Nhận xét tổng quan bằng Tiếng Việt)",
          "suggestions": "string (Danh sách các hành động cụ thể dưới dạng bullet points bằng Tiếng Việt)"
        }
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return JSON.parse(text) as SeoScoreResponse;
    } catch (error) {
      Logger.error(`AI Service SEO Scoring Error: ${error}`);
      return {
        score: 0,
        analysis: "Lỗi kết nối AI.",
        suggestions: "Không thể kết nối với trí tuệ nhân tạo để chấm điểm SEO lúc này. Vui lòng thử lại sau."
      };
    }
  }
}
