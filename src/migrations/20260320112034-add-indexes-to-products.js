'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('products');
    if (!tableDescription) return;

    const indexes = await queryInterface.showIndex('products');
    const existingIndexNames = indexes.map(idx => idx.name);

    if (!existingIndexNames.includes('products_product_type')) {
      await queryInterface.addIndex('products', ['product_type'], {
        name: 'products_product_type',
      });
    }

    if (!existingIndexNames.includes('products_is_active')) {
      await queryInterface.addIndex('products', ['is_active'], {
        name: 'products_is_active',
      });
    }

    if (!existingIndexNames.includes('products_product_type_is_active')) {
      await queryInterface.addIndex('products', ['product_type', 'is_active'], {
        name: 'products_product_type_is_active',
      });
    }

    if (!existingIndexNames.includes('products_created_at')) {
      await queryInterface.addIndex('products', ['created_at'], {
        name: 'products_created_at',
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('products', 'products_product_type').catch(() => {});
    await queryInterface.removeIndex('products', 'products_is_active').catch(() => {});
    await queryInterface.removeIndex('products', 'products_product_type_is_active').catch(() => {});
    await queryInterface.removeIndex('products', 'products_created_at').catch(() => {});
  }
};
