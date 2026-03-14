'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('seo_metas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      page_key: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      title_vi: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      title_en: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      title_zh: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      description_vi: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      description_en: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      description_zh: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      path: {
        type: Sequelize.STRING,
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

    await queryInterface.addIndex('seo_metas', ['page_key'], {
      unique: true,
      name: 'seo_metas_page_key_unique'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('seo_metas');
  }
};
