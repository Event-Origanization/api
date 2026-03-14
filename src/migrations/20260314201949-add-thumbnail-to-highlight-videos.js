'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('highlight_videos', 'thumbnail', {
      type: Sequelize.TEXT('long'),
      allowNull: true,
      after: 'url'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('highlight_videos', 'thumbnail');
  }
};
