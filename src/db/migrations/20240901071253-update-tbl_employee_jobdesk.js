'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("tbl_employee_jobdesk", "grader_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      onDelete: "CASCADE",
      references: {
        model: "tbl_employees",
        key: "id"
      }
    })
    await queryInterface.addColumn("tbl_employee_jobdesk", "is_graded", {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    })
    await queryInterface.addColumn("tbl_employee_jobdesk", "is_finish", {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    })
    await queryInterface.addColumn("tbl_employee_jobdesk", "graded_at", {
      type: Sequelize.DATE,
      allowNull: true
    })
    await queryInterface.addColumn("tbl_employee_jobdesk", "finished_at", {
      type: Sequelize.DATE,
      allowNull: true
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("tbl_employee_jobdesk", "grader_id")
    await queryInterface.removeColumn("tbl_employee_jobdesk", "is_graded")
    await queryInterface.removeColumn("tbl_employee_jobdesk", "is_finish")
    await queryInterface.removeColumn("tbl_employee_jobdesk", "graded_at")
    await queryInterface.removeColumn("tbl_employee_jobdesk", "finished_at")
  }
};
