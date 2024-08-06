'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_employee_attachment', {
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
      file_path: {
        type: Sequelize.STRING
      },
      file_name: {
        allowNull: true,
        type: Sequelize.STRING
      },
      file_type: {
        allowNull: true,
        type: Sequelize.STRING
      },
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("tbl_employee_attachment")
  }
};
