'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('website_configs', 'group', {
      type: Sequelize.STRING(50),
      allowNull: false,
      defaultValue: 'GENERAL',
      after: 'key'
    });
    
    await queryInterface.addIndex('website_configs', ['group']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('website_configs', ['group']);
    await queryInterface.removeColumn('website_configs', 'group');
  }
};
