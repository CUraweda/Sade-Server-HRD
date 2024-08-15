'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn('tbl_employee_form_announcement', 'approver_id', 'announcement_id');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn('tbl_employee_form_announcement', 'announcement_id', 'approver_id');
  }
};
