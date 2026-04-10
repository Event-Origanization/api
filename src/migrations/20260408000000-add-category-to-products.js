'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('products');
    
    if (!tableInfo.category) {
      await queryInterface.addColumn('products', 'category', {
        type: Sequelize.STRING(50),
        allowNull: true,
        after: 'product_type'
      });
    }

    // Index creation might still fail if already exists, but we can't easily check for indexes 
    // simply with describeTable. We'll use try-catch or just hope it's not and only the column is there.
    try {
      await queryInterface.addIndex('products', ['category'], {
        name: 'products_category_index'
      });
    } catch (e) {
      console.log('Index products_category_index already exists or could not be created');
    }

    try {
      await queryInterface.addIndex('products', ['product_type', 'category'], {
        name: 'products_type_category_index'
      });
    } catch (e) {
      console.log('Index products_type_category_index already exists or could not be created');
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('products', 'products_type_category_index');
    await queryInterface.removeIndex('products', 'products_category_index');
    await queryInterface.removeColumn('products', 'category');
  }
};
