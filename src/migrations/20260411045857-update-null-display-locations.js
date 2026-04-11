'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Backfill existing posts with null display_locations to ["OTHER_POST"]
    await queryInterface.sequelize.query(
      `UPDATE posts SET display_locations = '["OTHER_POST"]' WHERE display_locations IS NULL;`
    );
  },

  async down (queryInterface, Sequelize) {
    // Revert backfill if needed
    // Not strictly necessary as "null" was the implicit default, but to be safe:
    // await queryInterface.sequelize.query(
    //   `UPDATE posts SET display_locations = NULL WHERE JSON_CONTAINS(display_locations, '["OTHER_POST"]');`
    // );
  }
};
