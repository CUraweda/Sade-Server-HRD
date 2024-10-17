'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("tbl_employees", "raw_grade", {
      type: Sequelize.INTEGER,
      defaultValue: 0
    })
    await queryInterface.addColumn("tbl_employees", "raw_finished_task", {
      type: Sequelize.INTEGER,
      defaultValue: 0
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("tbl_employees", "raw_grade")
    await queryInterface.removeColumn("tbl_employees", "raw_finished_task")
  }
};
