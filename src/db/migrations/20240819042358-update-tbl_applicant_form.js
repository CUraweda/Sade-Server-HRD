'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("tbl_applicant_form", "employee_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "tbl_employees",
        key: "id"
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("tbl_applicant_form", "employee_id")
  }
};
