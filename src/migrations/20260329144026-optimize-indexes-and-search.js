'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // === 1. Bảng POSTS ===
    const postsIndexes = await queryInterface.showIndex('posts');
    const postsIndexNames = postsIndexes.map(idx => idx.name);

    // Index cho status (B-Tree)
    if (!postsIndexNames.includes('posts_status_index')) {
      await queryInterface.addIndex('posts', ['status'], {
        name: 'posts_status_index'
      });
    }

    // Nâng cấp Composite Index (Thêm created_at vào bộ status + publish_at)
    if (postsIndexNames.includes('posts_public_status_index')) {
      await queryInterface.removeIndex('posts', 'posts_public_status_index');
    }
    await queryInterface.addIndex('posts', ['status', 'publish_at', 'created_at'], {
      name: 'posts_public_composite_index'
    });

    // FULL-TEXT Index cho Post Search
    if (!postsIndexNames.includes('posts_search_fulltext')) {
      await queryInterface.addIndex('posts', ['title_vi', 'title_en', 'title_zh'], {
        name: 'posts_search_fulltext',
        type: 'FULLTEXT'
      });
    }

    // === 2. Bảng PRODUCTS ===
    const productsIndexes = await queryInterface.showIndex('products');
    const productsIndexNames = productsIndexes.map(idx => idx.name);

    // FULL-TEXT Index cho Product Search
    if (!productsIndexNames.includes('products_search_fulltext')) {
      await queryInterface.addIndex('products', ['name_vi', 'name_en', 'name_zh'], {
        name: 'products_search_fulltext',
        type: 'FULLTEXT'
      });
    }

    // === 3. Bảng HIGHLIGHT_VIDEOS ===
    const videosIndexes = await queryInterface.showIndex('highlight_videos');
    const videosIndexNames = videosIndexes.map(idx => idx.name);

    // Index cho is_active
    if (!videosIndexNames.includes('highlight_videos_is_active')) {
      await queryInterface.addIndex('highlight_videos', ['is_active'], {
        name: 'highlight_videos_is_active'
      });
    }

    // Index cho order_index
    if (!videosIndexNames.includes('highlight_videos_order_index')) {
      await queryInterface.addIndex('highlight_videos', ['order_index'], {
        name: 'highlight_videos_order_index'
      });
    }
  },

  async down(queryInterface, Sequelize) {
    // Bảng highlight_videos
    await queryInterface.removeIndex('highlight_videos', 'highlight_videos_order_index').catch(() => {});
    await queryInterface.removeIndex('highlight_videos', 'highlight_videos_is_active').catch(() => {});

    // Bảng products
    await queryInterface.removeIndex('products', 'products_search_fulltext').catch(() => {});

    // Bảng posts
    await queryInterface.removeIndex('posts', 'posts_search_fulltext').catch(() => {});
    await queryInterface.removeIndex('posts', 'posts_public_composite_index').catch(() => {});
    await queryInterface.removeIndex('posts', 'posts_status_index').catch(() => {});

    // Khôi phục index cũ của posts nếu cần
    await queryInterface.addIndex('posts', ['status', 'publish_at'], {
      name: 'posts_public_status_index'
    }).catch(() => {});
  }
};
