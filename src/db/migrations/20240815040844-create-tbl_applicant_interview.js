'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_applicant_interview', {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      form_id: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "tbl_applicant_form",
          key: "id"
        }
      },
      interviewer_id: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "tbl_employees",
          key: "id"
        }
      },
      plan_date: {
        allowNull: true,
        type: Sequelize.DATE
      },
      portal: {
        allowNull: true,
        type: Sequelize.STRING
      },
      is_finish: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      outcome: {
        type: Sequelize.ENUM("LULUS","TIDAK LULUS")
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("tbl_training")
  }
};
