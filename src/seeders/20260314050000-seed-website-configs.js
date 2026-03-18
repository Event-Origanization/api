'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Clear existing data to avoid validation errors
    await queryInterface.bulkDelete('website_configs', null, {});

    const configs = [
      // GENERAL
      {
        key: 'WEBSITE_NAME',
        group: 'GENERAL',
        value_vi: '5P Event',
        value_en: '5P Event',
        value_zh: '5P Event',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        key: 'WEBSITE_FULLNAME',
        group: 'GENERAL',
        value_vi: 'CÔNG TY TNHH TRUYỀN THÔNG VÀ TỔ CHỨC SỰ KIỆN 5P EVENT',
        value_en: '5P EVENT MEDIA AND EVENT ORGANIZATION CO., LTD',
        value_zh: '5P EVENT 传媒与活动策划有限公司',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        key: 'WEBSITE_SLOGAN',
        group: 'GENERAL',
        value_vi: 'Khởi nguồn cảm xúc, trọn vẹn thương hiệu',
        value_en: 'Create Emotions, Capture Your Brand',
        value_zh: '创造情感，彰显品牌',
        created_at: new Date(),
        updated_at: new Date()
      },
      // CONTACT
      {
        key: 'CONTACT_HOTLINE',
        group: 'CONTACT',
        value_vi: '0901.234.567',
        value_en: '0901.234.567',
        value_zh: '0901.234.567',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        key: 'CONTACT_EMAIL',
        group: 'CONTACT',
        value_vi: 'info@5pevent.vn',
        value_en: 'info@5pevent.vn',
        value_zh: 'info@5pevent.vn',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        key: 'CONTACT_ADDRESS',
        group: 'CONTACT',
        value_vi: '123 Đường ABC, Quận 1, TP. HCM',
        value_en: '123 ABC Street, District 1, HCMC',
        value_zh: '胡志明市第一区 ABC 路 123 号',
        created_at: new Date(),
        updated_at: new Date()
      },
      // SOCIAL
      {
        key: 'SOCIAL_FACEBOOK',
        group: 'SOCIAL',
        value_vi: 'https://fb.com/5pevent',
        value_en: 'https://fb.com/5pevent',
        value_zh: 'https://fb.com/5pevent',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        key: 'SOCIAL_ZALO',
        group: 'SOCIAL',
        value_vi: 'https://zalo.me/5pevent',
        value_en: 'https://zalo.me/5pevent',
        value_zh: 'https://zalo.me/5pevent',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        key: 'SOCIAL_YOUTUBE',
        group: 'SOCIAL',
        value_vi: 'https://youtube.com/@5pevent',
        value_en: 'https://youtube.com/@5pevent',
        value_zh: 'https://youtube.com/@5pevent',
        created_at: new Date(),
        updated_at: new Date()
      },
      // MENU
      {
        key: 'MENU_HOME',
        group: 'MENU',
        value_vi: 'Trang chủ',
        value_en: 'Home',
        value_zh: '首页',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        key: 'MENU_ABOUT',
        group: 'MENU',
        value_vi: 'Giới thiệu',
        value_en: 'About Us',
        value_zh: '关于我们',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        key: 'MENU_EVENTS',
        group: 'MENU',
        value_vi: 'Tổ chức sự kiện',
        value_en: 'Event Organization',
        value_zh: '活动策划',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        key: 'MENU_SOUND_LIGHT',
        group: 'MENU',
        value_vi: 'Âm thanh ánh sáng',
        value_en: 'Sound & Lighting',
        value_zh: '音响灯光',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        key: 'MENU_RENTAL',
        group: 'MENU',
        value_vi: 'Cho thuê thiết bị sự kiện',
        value_en: 'Event Equipment Rental',
        value_zh: '活动设备租赁',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        key: 'MENU_CONTACT',
        group: 'MENU',
        value_vi: 'Liên hệ',
        value_en: 'Contact',
        value_zh: '联系我们',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('website_configs', configs);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('website_configs', null, {});
  }
};
