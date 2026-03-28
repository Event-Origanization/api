'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('home_videos', [
      {
        title_vi: 'MUNICH INTERACTIVE INTELLIGENCE INITIATIVE',
        title_en: 'MUNICH INTERACTIVE INTELLIGENCE INITIATIVE',
        title_zh: 'MUNICH INTERACTIVE INTELLIGENCE INITIATIVE',
        url: null,
        thumbnail: 'https://res.cloudinary.com/dummy/image/upload/home-main-image.jpg',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('home_videos', { 
      title_vi: 'MUNICH INTERACTIVE INTELLIGENCE INITIATIVE' 
    }, {});
  }
};
