'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_applicant_form', {
      id: {
        autoIncrement: true,
        primaryKey: true, 
        type: Sequelize.INTEGER
      },
      vacancy_id: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "tbl_job_vacancy",
          key: "id"
        }
      },
      user_id: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "ref_users",
          key: "id"
        }  
      },
      full_name: {
        allowNull: true, 
        type: Sequelize.STRING
      },
      email: {
        allowNull: true, 
        type: Sequelize.STRING
      },
      phone : {
        allowNull: true, 
        type: Sequelize.STRING
      },
      nik: {
        allowNull: true, 
        type: Sequelize.STRING
      },
      pob: {
        allowNull: true, 
        type: Sequelize.STRING
      },
      dob: {
        allowNull: true, 
        type: Sequelize.DATE
      },
      religion: {
        allowNull: true, 
        type: Sequelize.STRING
      },
      martial_status: {
        allowNull: true, 
        type: Sequelize.STRING
      },
      address : {
        allowNull: true, 
        type: Sequelize.TEXT
      },
      city : {
        type: Sequelize.STRING
      },
      applicant_description : {
        allowNull: true, 
        type: Sequelize.TEXT
      },
      applicant_vision : {
        allowNull: true, 
        type: Sequelize.TEXT
      },
      applicant_reason : {
        allowNull: true, 
        type: Sequelize.TEXT
      },
      applicant_question : {
        allowNull: true, 
        type: Sequelize.TEXT
      },
      status : {
        allowNull: true, 
        type: Sequelize.STRING
      },
      is_passed : {
        allowNull: true, 
        type: Sequelize.BOOLEAN
      },
      file_path : {
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
    await queryInterface.dropTable("tbl_applicant_form")
  }
};
