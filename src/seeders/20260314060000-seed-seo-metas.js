'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Clear existing data to avoid validation errors
    await queryInterface.bulkDelete('seo_metas', null, {});

    const metas = [
      {
        page_key: 'HOME',
        title_vi: 'Trang chủ | 5P Event - Đơn vị tổ chức sự kiện chuyên nghiệp',
        title_en: 'Home | 5P Event - Professional Event Organizer',
        title_zh: '首页 | 5P Event - 专业活动策划公司',
        description_vi: '5P Event chuyên tổ chức sự kiện khai trương, khánh thành, hội nghị, tiệc tất niên chuyên nghiệp tại TP.HCM.',
        description_en: '5P Event specializes in organizing professional grand openings, inaugurations, conferences, and year-end parties in HCMC.',
        description_zh: '5P Event 专业策划胡志明市的开业典礼、落成典礼、会议和年终派对。',
        path: '/',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        page_key: 'ABOUT',
        title_vi: 'Giới thiệu | 5P Event',
        title_en: 'About Us | 5P Event',
        title_zh: '关于我们 | 5P Event',
        description_vi: 'Tìm hiểu về tầm nhìn, sứ mệnh và giá trị cốt lõi của 5P Event.',
        description_en: 'Learn about the vision, mission, and core values of 5P Event.',
        description_zh: '了解 5P Event 的愿景、使命和核心价值观。',
        path: '/about',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        page_key: 'EVENTS',
        title_vi: 'Tổ chức sự kiện | 5P Event',
        title_en: 'Event Organization | 5P Event',
        title_zh: '活动策划 | 5P Event',
        description_vi: 'Dịch vụ tổ chức sự kiện chuyên nghiệp, sáng tạo.',
        description_en: 'Professional and creative event organization services.',
        description_zh: '专业、创意的活动策划服务。',
        path: '/events',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        page_key: 'SOUND_LIGHT',
        title_vi: 'Âm thanh ánh sáng | 5P Event',
        title_en: 'Sound & Lighting | 5P Event',
        title_zh: '音响灯光 | 5P Event',
        description_vi: 'Cung cấp hệ thống âm thanh ánh sáng hiện đại.',
        description_en: 'Provide modern sound and lighting systems.',
        description_zh: '提供现代音响灯光系统。',
        path: '/sound-lighting',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        page_key: 'RENTAL',
        title_vi: 'Cho thuê thiết bị | 5P Event',
        title_en: 'Equipment Rental | 5P Event',
        title_zh: '设备租赁 | 5P Event',
        description_vi: 'Cho thuê thiết bị sự kiện trọn gói.',
        description_en: 'Comprehensive event equipment rental.',
        description_zh: '全面活动设备租赁。',
        path: '/rental',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        page_key: 'CONTACT',
        title_vi: 'Liên hệ với chúng tôi | 5P Event',
        title_en: 'Contact Us | 5P Event',
        title_zh: '联系我们 | 5P Event',
        description_vi: 'Liên hệ với 5P Event để được tư vấn và báo giá tổ chức sự kiện tốt nhất.',
        description_en: 'Contact 5P Event for the best event organization advice and quotes.',
        description_zh: '联系 5P Event 以获取最佳的 activity organization advice and quotes。',
        path: '/contact',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('seo_metas', metas);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('seo_metas', null, {});
  }
};
