'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('website_configs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      key: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      value_vi: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      value_en: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      value_zh: {
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

    await queryInterface.addIndex('website_configs', ['key'], {
      unique: true,
      name: 'website_configs_key_unique'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('website_configs');
  }
};
