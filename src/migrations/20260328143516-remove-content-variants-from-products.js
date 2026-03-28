'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('products', 'content_vi');
    await queryInterface.removeColumn('products', 'content_en');
    await queryInterface.removeColumn('products', 'content_zh');
    await queryInterface.removeColumn('products', 'variants');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('products', 'content_vi', {
      type: Sequelize.TEXT('long'),
      allowNull: false,
      defaultValue: '',
    });
    await queryInterface.addColumn('products', 'content_en', {
      type: Sequelize.TEXT('long'),
      allowNull: true,
    });
    await queryInterface.addColumn('products', 'content_zh', {
      type: Sequelize.TEXT('long'),
      allowNull: true,
    });
    await queryInterface.addColumn('products', 'variants', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: [],
    });
  }
};
