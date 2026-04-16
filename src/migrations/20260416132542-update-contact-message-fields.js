'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('contact_messages', 'email', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn('contact_messages', 'phone', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('contact_messages', 'email', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.changeColumn('contact_messages', 'phone', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};
