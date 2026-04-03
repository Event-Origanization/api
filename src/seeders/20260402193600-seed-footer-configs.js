'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const footerColumns = [
      {
        title: { vi: 'GIỚI THIỆU', en: 'ABOUT US', zh: '关于我们' },
        link: 'HOME',
        items: [
          { title: { vi: 'Khám phá dịch vụ', en: 'Explore services', zh: '探索服务' }, link: 'HOME' },
          { title: { vi: 'Trải nghiệm tương tác', en: 'Interactive experience', zh: '互动体验' }, link: 'HOME' },
          { title: { vi: 'Giải pháp sự kiện', en: 'Event solutions', zh: '活动解决方案' }, link: 'HOME' },
          { title: { vi: 'Khám phá sáng tạo', en: 'Creative discovery', zh: '创意探索' }, link: 'HOME' }
        ]
      },
      {
        title: { vi: 'TỔ CHỨC SỰ KIỆN', en: 'EVENTS', zh: '活动策划' },
        link: 'EVENTS',
        items: [
          { title: { vi: 'Dự án tiêu biểu', en: 'Featured projects', zh: '典型项目' }, link: 'EVENTS' },
          { title: { vi: 'Sự kiện cộng đồng', en: 'Community events', zh: '社区活动' }, link: 'EVENTS' }
        ]
      },
      {
        title: { vi: 'TIN TỨC', en: 'NEWS', zh: '新闻' },
        link: 'NEWS',
        items: [
          { title: { vi: 'Đa phương tiện', en: 'Multimedia', zh: '多媒体' }, link: 'NEWS' },
          { title: { vi: 'Blog tin tức', en: 'News blog', zh: '新闻博客' }, link: 'NEWS' },
          { title: { vi: 'Sự kiện sắp tới', en: 'Upcoming events', zh: '即将举行的活动' }, link: 'NEWS' }
        ]
      },
      {
        title: { vi: 'CHO THUÊ THIẾT BỊ SỰ KIỆN', en: 'EVENT RENTAL', zh: '活动设备租赁' },
        link: 'RENTAL',
        items: []
      },
      {
        title: { vi: 'LIÊN HỆ', en: 'CONTACT', zh: '联系我们' },
        link: 'CONTACT',
        items: []
      }
    ];

    const jsonValue = JSON.stringify(footerColumns);

    await queryInterface.bulkInsert('website_configs', [
      {
        key: 'FOOTER_COLUMNS',
        group: 'FOOTER',
        value_vi: jsonValue,
        value_en: jsonValue,
        value_zh: jsonValue,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('website_configs', { key: 'FOOTER_COLUMNS' }, {});
  }
};
