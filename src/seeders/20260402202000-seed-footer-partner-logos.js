'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const partnerLogos = [
      { id: 'logo-1', name: 'LMU (Munich)', image: '', link: 'https://www.lmu.de' },
      { id: 'logo-2', name: 'EU & ERC', image: '', link: 'https://erc.europa.eu' },
      { id: 'logo-3', name: 'DFG', image: '', link: 'https://www.dfg.de' },
      { id: 'logo-4', name: 'VolkswagenStiftung', image: '', link: 'https://www.volkswagenstiftung.de' },
      { id: 'logo-5', name: 'bidt', image: '', link: 'https://www.bidt.digital' }
    ];

    const jsonValue = JSON.stringify(partnerLogos);

    await queryInterface.bulkInsert('website_configs', [
      {
        key: 'FOOTER_PARTNER_LOGOS',
        group: 'FOOTER',
        value_vi: jsonValue,
        value_en: jsonValue,
        value_zh: jsonValue,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('website_configs', { key: 'FOOTER_PARTNER_LOGOS' }, {});
  }
};
