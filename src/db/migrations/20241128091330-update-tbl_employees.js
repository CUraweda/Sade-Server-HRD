'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("tbl_employees", "current_evaluation_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "tbl_employee_evaluation",
        key: "id"
      },
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("tbl_employees", "current_evaluation_id")
  }
};
