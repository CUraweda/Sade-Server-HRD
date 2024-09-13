'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("tbl_employee_attachment", "description", {
      type: Sequelize.STRING,
      allowNull: true,
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("tbl_employee_attachment", "description")
  }
};
