'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_applicant_skill', {
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
      description : {
        allowNull: true, 
        type: Sequelize.TEXT
      },
      level : {
        allowNull: true, 
        type: Sequelize.STRING
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
    await queryInterface.dropTable("tbl_applicant_skill")
  }
};
