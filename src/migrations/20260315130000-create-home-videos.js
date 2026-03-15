'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('home_videos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title_vi: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      title_en: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      title_zh: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      url: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      thumbnail: {
        type: Sequelize.TEXT('long'),
        allowNull: true
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('home_videos');
  }
};
