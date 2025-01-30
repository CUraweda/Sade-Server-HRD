'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("tbl_applicant_form", "psychology_place", {
      type: Sequelize.STRING,
      allowNull: true
    })
    await queryInterface.addColumn("tbl_applicant_form", "psychology_date", {
      type: Sequelize.DATE,
      allowNull: true
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("tbl_applicant_form", "psychology_place")
    await queryInterface.removeColumn("tbl_applicant_form", "psychology_date")
  }
};
