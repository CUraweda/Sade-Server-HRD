'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_employee_form_announcement', {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      employee_id: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "tbl_employees",
          key: "id"
        }
      },
      approver_id: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "tbl_employee_announcement",
          key: "id"
        }
      }
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("tbl_employee_form_announcement")
  }
};
