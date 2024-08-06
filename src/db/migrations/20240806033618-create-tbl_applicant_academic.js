'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_applicant_academic', {
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
      degree: {
        allowNull: true, 
        type: Sequelize.STRING
      },
      city: {
        allowNull: true, 
        type: Sequelize.STRING
      },
      institution: {
        allowNull: true, 
        type: Sequelize.STRING
      },
      description : {
        allowNull: true, 
        type: Sequelize.TEXT
      },
      is_kuliah : {
        type: Sequelize.BOOLEAN
      },
      start_date: {
        type: Sequelize.DATE
      },
      end_date : {
        type: Sequelize.DATE
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
    await queryInterface.dropTable("tbl_applicant_academic")
  }
};
