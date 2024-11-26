'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_employee_evaluation_items', {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      division_id: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "ref_division",
          key: "id"
        }
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      grade_group_id: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "tbl_jobdesk_group_grading",
          key: "id"
        }
      },
      unit_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "ref_jobdesk_unit",
          key: "id"
        }
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("tbl_employee_evaluation_items")
  }
};
