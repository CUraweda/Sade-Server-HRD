'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("tbl_employee_account", "other_income", {
      type: Sequelize.DOUBLE,
      defaultValue: 0
    })
    await queryInterface.addColumn("tbl_employee_account", "other_cut", {
      type: Sequelize.DOUBLE,
      defaultValue: 0
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("tbl_employee_account", "other_income")
    await queryInterface.removeColumn("tbl_employee_account", "other_cut")
  }
};
