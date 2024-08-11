"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn('tbl_job_vacancy', 'divison_id', 'division_id');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn('tbl_job_vacancy', 'division_id', 'divison_id');
  }
};
