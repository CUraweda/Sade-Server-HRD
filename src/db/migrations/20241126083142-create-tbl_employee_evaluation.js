'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_employee_evaluation', {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      employee_id: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references:{
          model: "tbl_employees",
          key: "id"
        }
      },
      month_start: {
        type: Sequelize.INTEGER,
      },
      month_end: {
        type: Sequelize.INTEGER,
      },
      academic_year: {
        type: Sequelize.STRING
      },
      uid: {
        unique: true,
        type: Sequelize.STRING
      },
      is_done: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      file_path: {
        allowNull: true,
        type: Sequelize.STRING
      },
      division_id: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "ref_division",
          key: "id"
        }
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("tbl_employee_evaluation")
  }
};
