'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_employee_account', {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      salary_id: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "tbl_employee_salary",
          key: "id"
        }
      },
      employee_id: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "tbl_employees",
          key: "id"
        }
      },
      month_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "ref_months",
          key: "id"
        }
      },
      year: {
        type: Sequelize.INTEGER,
      },
      uid: {
        unique: true,
        type: Sequelize.STRING
      },
      status: {
        allowNull: true,
        type: Sequelize.STRING
      },
      is_paid: {
        defaultValue: false,
        type: Sequelize.BOOLEAN
      },
      temp_total: {
        defaultValue: 0,
        type: Sequelize.DOUBLE
      },
      fixed_salary: {
        defaultValue: 0,
        type: Sequelize.DOUBLE
      },
      variable_salary: {
        defaultValue: 0,
        type: Sequelize.DOUBLE
      },
      loan: {
        defaultValue: 0,
        type: Sequelize.DOUBLE
      },
      cooperative: {
        defaultValue: 0,
        type: Sequelize.DOUBLE
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("tbl_employee_account")
  }
};
