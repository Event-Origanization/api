'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('posts', 'display_locations', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: ['OTHER_POST']
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('posts', 'display_locations');
  }
};
