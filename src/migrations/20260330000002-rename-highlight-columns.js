'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('highlights', 'orderIndex', 'order_index');
    await queryInterface.renameColumn('highlights', 'createdAt', 'created_at');
    await queryInterface.renameColumn('highlights', 'updatedAt', 'updated_at');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('highlights', 'order_index', 'orderIndex');
    await queryInterface.renameColumn('highlights', 'created_at', 'createdAt');
    await queryInterface.renameColumn('highlights', 'updated_at', 'updatedAt');
  }
};
