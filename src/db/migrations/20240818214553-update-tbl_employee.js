'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("tbl_employees", "still_in_probation", {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    })
    await queryInterface.addColumn("tbl_employees", "probation_start_date", {
      type: Sequelize.DATE,
      allowNull: true,
    })
    await queryInterface.addColumn("tbl_employees", "probation_end_date", {
      type: Sequelize.DATE,
      allowNull: true,
    })
    await queryInterface.addColumn("tbl_employees", "phone", {
      type: Sequelize.STRING,
      allowNull: true,
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("tbl_employees", "still_in_probation")
    await queryInterface.removeColumn("tbl_employees", "probation_start_date")
    await queryInterface.removeColumn("tbl_employees", "probation_end_date")
    await queryInterface.removeColumn("tbl_employees", "phone")
  }
};
