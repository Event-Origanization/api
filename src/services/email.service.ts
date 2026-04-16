import nodemailer from 'nodemailer';
import { ENV, Logger } from '@/lib';

export class EmailService {
  private static transporter: nodemailer.Transporter;

  /**
   * Initialize email transporter
   */
  static initializeTransporter() {
    this.transporter = nodemailer.createTransport({
      host: ENV.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(ENV.EMAIL_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: ENV.EMAIL_USER,
        pass: ENV.EMAIL_PASS,
      },
    });
  }

  /**
   * Generate OTP code
   */
  static generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Send OTP email
   */
  static async sendOTPEmail(email: string, otp: string, username: string): Promise<boolean> {
    try {
      if (!this.transporter) {
        this.initializeTransporter();
      }

      const mailOptions = {
        from: ENV.EMAIL_USER,
        to: email,
        subject: 'Xác thực tài khoản - AIRemake Pro',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
              <h1 style="color: #333; margin: 0;">AIRemake Pro</h1>
            </div>
            <div style="padding: 30px; background-color: #ffffff;">
              <h2 style="color: #333; margin-bottom: 20px;">Xin chào ${username}!</h2>
              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                Cảm ơn bạn đã đăng ký tài khoản tại AIRemake Pro. Để hoàn tất quá trình đăng ký, 
                vui lòng sử dụng mã OTP dưới đây:
              </p>
              <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                <h1 style="color: #007bff; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
              </div>
              <p style="color: #999; font-size: 14px; margin-top: 30px;">
                Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.
              </p>
            </div>
            <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
              <p style="color: #666; margin: 0; font-size: 14px;">
                © 2025 AIRemake Pro. All rights reserved.
              </p>
            </div>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  /**
   * Send password reset email
   */
  static async sendPasswordResetEmail(email: string, resetToken: string, username: string): Promise<boolean> {
    try {
      if (!this.transporter) {
        this.initializeTransporter();
      }

      const resetUrl = `${ENV.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

      const mailOptions = {
        from: ENV.EMAIL_USER,
        to: email,
        subject: 'Đặt lại mật khẩu - AIRemake Pro',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
              <h1 style="color: #333; margin: 0;">AIRemake Pro</h1>
            </div>
            <div style="padding: 30px; background-color: #ffffff;">
              <h2 style="color: #333; margin-bottom: 20px;">Xin chào ${username}!</h2>
              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình. 
                Vui lòng nhấp vào nút bên dưới để đặt lại mật khẩu:
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" 
                   style="background-color: #007bff; color: #ffffff; padding: 12px 30px; 
                          text-decoration: none; border-radius: 5px; display: inline-block;">
                  Đặt lại mật khẩu
                </a>
              </div>
              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                Nếu nút không hoạt động, bạn có thể copy và paste link sau vào trình duyệt:
              </p>
              <p style="color: #007bff; word-break: break-all; font-size: 14px;">
                ${resetUrl}
              </p>
              <p style="color: #999; font-size: 14px; margin-top: 30px;">
                Link này sẽ hết hạn sau 1 giờ. Nếu bạn không yêu cầu đặt lại mật khẩu, 
                vui lòng bỏ qua email này.
              </p>
            </div>
            <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
              <p style="color: #666; margin: 0; font-size: 14px;">
                © 2025 AIRemake Pro. All rights reserved.
              </p>
            </div>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending password reset email:', error);
      return false;
    }
  }

  /**
   * Send contact message notification email to company
   */
  static async sendContactMessageNotification(data: {
    name: string;
    email: string | null;
    phone?: string;
    message: string;
  }): Promise<boolean> {
    try {
      if (!this.transporter) {
        this.initializeTransporter();
      }

      const companyEmail = ENV.EMAIL_COMPANY;
      if (!companyEmail) {
        Logger.error('[EmailService] EMAIL_COMPANY is not configured. Skipping notification.');
        return false;
      }

      const receivedAt = new Date().toLocaleString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        dateStyle: 'full',
        timeStyle: 'short',
      });

      const phoneDisplay = data.phone
        ? `<div style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">
              <p style="margin: 0 0 4px 0; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">📞 Số điện thoại</p>
              <p style="margin: 0; color: #333; font-size: 15px; font-weight: 600;">${data.phone}</p>
            </div>`
        : '';

      const mailOptions = {
        from: `"5PEVENT" <${ENV.EMAIL_USER}>`,
        to: companyEmail,
        subject: `🔔 TIN NHẮN LIÊN HỆ MỚI TỪ: ${data.name}`,
        html: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 620px; width: 100%; margin: 0 auto; background-color: #f5f7fa; padding: 16px; box-sizing: border-box;">

            <!-- Header -->
            <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); padding: 28px 20px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 1px; line-height: 1.4;">
                🔔 Tin Nhắn Liên Hệ Mới
              </h1>
              <p style="color: #a0aec0; margin: 8px 0 0 0; font-size: 13px;">
                Nhận lúc: ${receivedAt}
              </p>
            </div>

            <!-- Body -->
            <div style="background-color: #ffffff; padding: 24px 20px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.08);">

              <p style="color: #555; font-size: 14px; margin: 0 0 20px 0; line-height: 1.6;">
                Một khách hàng vừa gửi tin nhắn liên hệ qua website. Dưới đây là thông tin chi tiết:
              </p>

              <!-- Info Cards (stacked, mobile-safe) -->
              <div style="margin-bottom: 20px;">

                <div style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">
                  <p style="margin: 0 0 4px 0; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">👤 Họ và tên</p>
                  <p style="margin: 0; color: #333; font-size: 15px; font-weight: 600;">${data.name}</p>
                </div>

                <div style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">
                  <p style="margin: 0 0 4px 0; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">✉️ Email</p>
                  <a href="mailto:${data.email}" style="color: #0f3460; text-decoration: none; font-weight: 600; font-size: 15px; word-break: break-all;">${data.email}</a>
                </div>

                ${phoneDisplay}

              </div>

              <!-- Message Block -->
              <div style="margin-bottom: 8px;">
                <p style="color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 10px 0;">💬 Nội dung tin nhắn</p>
                <div style="background-color: #f8f9fc; border-left: 4px solid #0f3460; border-radius: 0 8px 8px 0; padding: 14px 16px;">
                  <p style="color: #333; font-size: 14px; margin: 0; line-height: 1.8; white-space: pre-wrap; word-break: break-word;">${data.message}</p>
                </div>
              </div>

              <!-- CTA -->
              <div style="margin-top: 24px; text-align: center;">
                <a href="mailto:${data.email}"
                   style="background: linear-gradient(135deg, #0f3460, #16213e); color: #ffffff; padding: 12px 24px;
                          text-decoration: none; border-radius: 8px; display: inline-block; font-size: 14px; font-weight: 600; letter-spacing: 0.5px;">
                  ↩️ Phản Hồi Ngay
                </a>
              </div>
            </div>

            <!-- Footer -->
            <div style="text-align: center; padding: 16px 0 0 0;">
              <p style="color: #aaa; font-size: 12px; margin: 0; line-height: 1.6;">
                Email này được gửi tự động từ hệ thống 5PEVENT.<br>Vui lòng không reply trực tiếp email này.
              </p>
            </div>

          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      Logger.error(`[EmailService] Error sending contact message notification: ${error}`);
      return false;
    }
  }
} 