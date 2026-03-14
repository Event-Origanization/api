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
        title_vi: 'Về chúng tôi | 5P Event',
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
        page_key: 'PRODUCTS',
        title_vi: 'Dịch vụ sự kiện | 5P Event',
        title_en: 'Event Services | 5P Event',
        title_zh: '活动服务 | 5P Event',
        description_vi: 'Các gói dịch vụ tổ chức sự kiện trọn gói, chuyên nghiệp và sáng tạo.',
        description_en: 'Comprehensive, professional, and creative event organization service packages.',
        description_zh: '全面、专业、创意的活动策划服务包。',
        path: '/products',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        page_key: 'POSTS',
        title_vi: 'Tin tức & Sự kiện | 5P Event',
        title_en: 'News & Events | 5P Event',
        title_zh: '新闻与活动 | 5P Event',
        description_vi: 'Cập nhật những tin tức mới nhất về ngành sự kiện và các dự án của 5P Event.',
        description_en: 'Update the latest news about the event industry and projects of 5P Event.',
        description_zh: '更新有关活动行业和 5P Event 项目 transformation 的最新新闻。',
        path: '/posts',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        page_key: 'CONTACT',
        title_vi: 'Liên hệ với chúng tôi | 5P Event',
        title_en: 'Contact Us | 5P Event',
        title_zh: '联系 chúng tôi | 5P Event',
        description_vi: 'Liên hệ với 5P Event để được tư vấn và báo giá tổ chức sự kiện tốt nhất.',
        description_en: 'Contact 5P Event for the best event organization advice and quotes.',
        description_zh: '联系 5P Event 以获取最佳的活动策划建议和报价。',
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
