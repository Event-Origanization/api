'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('posts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      content: {
        type: Sequelize.TEXT('long'),
        allowNull: false,
      },
      media: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('DRAFT', 'SCHEDULED', 'PUBLISHED'),
        allowNull: false,
        defaultValue: 'DRAFT',
      },
      publish_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      seo_score: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      seo_feedback: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.addIndex('posts', ['slug'], {
      unique: true,
      name: 'posts_slug_unique'
    });
    await queryInterface.addIndex('posts', ['status'], {
      name: 'posts_status_index'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('posts');
  }
};
