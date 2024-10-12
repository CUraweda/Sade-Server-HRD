'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("tbl_employees", "active_outstation_id", {
      type: Sequelize.INTEGER,
      onDelete: "CASCADE",
      references: {
        model: "tbl_employee_outstation",
        key: "id"
      },
      allowNull: true,
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("tbl_employees", "active_outstation_id")
  }
};
