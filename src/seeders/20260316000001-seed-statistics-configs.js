'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const configs = [
      {
        key: 'STATS_FIELDS',
        group: 'STATISTICS',
        value_vi: '3',
        value_en: '3',
        value_zh: '3',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        key: 'STATS_EVENTS',
        group: 'STATISTICS',
        value_vi: '1500+',
        value_en: '1500+',
        value_zh: '1500+',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        key: 'STATS_BRANDS',
        group: 'STATISTICS',
        value_vi: '500+',
        value_en: '500+',
        value_zh: '500+',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    // Check if keys already exist to avoid duplicates
    for (const config of configs) {
      const existing = await queryInterface.sequelize.query(
        `SELECT id FROM website_configs WHERE \`key\` = '${config.key}'`,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );
      
      if (existing.length === 0) {
        await queryInterface.bulkInsert('website_configs', [config]);
      }
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('website_configs', {
      key: {
        [Sequelize.Op.in]: ['STATS_FIELDS', 'STATS_EVENTS', 'STATS_BRANDS']
      }
    });
  }
};
