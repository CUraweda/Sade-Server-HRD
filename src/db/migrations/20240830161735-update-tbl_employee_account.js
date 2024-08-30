'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("tbl_employee_account", "paid_amount", {
      type: Sequelize.DOUBLE,
      defaultValue: 0
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("tbl_employee_account", "paid_amount")
  }
};
