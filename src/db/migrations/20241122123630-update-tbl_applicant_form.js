'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("tbl_applicant_form", "is_passed_selection", {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    })
    await queryInterface.addColumn("tbl_applicant_form", "is_passed_psychological_test", {
      type: Sequelize.BOOLEAN,
      allowNull: true
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("tbl_applicant_form", "is_passed_selection")
    await queryInterface.removeColumn("tbl_applicant_form", "is_passed_psychological_test")
  }
};
