'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("tbl_employee_jobdesk", "partner_ids", {
      type: Sequelize.STRING,
      defaultValue: ""
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("tbl_employee_jobdesk", "partner_ids")
  }
};
