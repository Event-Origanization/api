'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name_vi: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      name_en: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      name_zh: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      slug: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      content_vi: {
        type: Sequelize.TEXT('long'),
        allowNull: false,
      },
      content_en: {
        type: Sequelize.TEXT('long'),
        allowNull: true,
      },
      content_zh: {
        type: Sequelize.TEXT('long'),
        allowNull: true,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      images: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      variants: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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

    await queryInterface.addIndex('products', ['slug'], {
      unique: true,
      name: 'products_slug_unique'
    });
    await queryInterface.addIndex('products', ['is_active'], {
      name: 'products_is_active_index'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('products');
  }
};
