'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('partners', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      logo: {
        type: Sequelize.TEXT('long'),
        allowNull: true,
      },
      order_index: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addIndex('partners', ['is_active'], {
      name: 'partners_is_active_idx',
    });

    await queryInterface.addIndex('partners', ['order_index'], {
      name: 'partners_order_index_idx',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('partners');
  },
};
