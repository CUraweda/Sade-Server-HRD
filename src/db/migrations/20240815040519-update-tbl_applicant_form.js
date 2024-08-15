'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("tbl_applicant_form", "is_passed_interview", {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("tbl_applicant_form", "is_passed_interview")
  }
};
