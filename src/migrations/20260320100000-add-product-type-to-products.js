'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('products', 'product_type', {
      type: Sequelize.ENUM('SOUND_LIGHT', 'RENTAL'),
      allowNull: false,
      defaultValue: 'RENTAL',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('products', 'product_type');
    // Note: To completely remove the ENUM type in some databases (like PostgreSQL), 
    // you might need additional commands, but for simple cases removeColumn is enough.
    // MySQL handles it automatically when the column is gone.
  }
};
