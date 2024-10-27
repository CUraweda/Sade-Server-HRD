'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("tbl_employees", "needed_employee_files", {
      type: Sequelize.STRING,
      defaultValue: ""
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("tbl_employees", "needed_employee_files")
  }
};
