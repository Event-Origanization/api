'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Thêm các trường SEO mới
    await queryInterface.addColumn('posts', 'seo_analysis', {
      type: Sequelize.TEXT,
      allowNull: true,
      after: 'seo_score'
    });
    await queryInterface.addColumn('posts', 'seo_suggestions', {
      type: Sequelize.TEXT,
      allowNull: true,
      after: 'seo_analysis'
    });

    // 2. Xóa trường SEO cũ (nếu muốn dọn dẹp)
    // Lưu ý: Thường nên backup dữ liệu trước khi xóa, nhưng ở đây user yêu cầu "update thành 2 cái này"
    const tableInfo = await queryInterface.describeTable('posts');
    if (tableInfo.seo_feedback) {
      await queryInterface.removeColumn('posts', 'seo_feedback');
    }

    // 3. Bổ sung các Index để tối ưu hiệu năng
    // Index cho publish_at (dùng nhiều khi lọc bài viết đã đăng)
    await queryInterface.addIndex('posts', ['publish_at'], {
      name: 'posts_publish_at_index'
    });

    // Index cho created_at (dùng khi sắp xếp mặc định)
    await queryInterface.addIndex('posts', ['created_at'], {
      name: 'posts_created_at_index'
    });

    // Composite Index cho việc truy vấn bài viết công khai (status + publish_at)
    await queryInterface.addIndex('posts', ['status', 'publish_at'], {
      name: 'posts_public_status_index'
    });
  },

  async down(queryInterface, Sequelize) {
    // Hoàn tác các index
    await queryInterface.removeIndex('posts', 'posts_public_status_index');
    await queryInterface.removeIndex('posts', 'posts_created_at_index');
    await queryInterface.removeIndex('posts', 'posts_publish_at_index');

    // Khôi phục cột cũ
    await queryInterface.addColumn('posts', 'seo_feedback', {
      type: Sequelize.TEXT,
      allowNull: true,
      after: 'seo_score'
    });

    // Xóa cột mới
    await queryInterface.removeColumn('posts', 'seo_suggestions');
    await queryInterface.removeColumn('posts', 'seo_analysis');
  }
};
