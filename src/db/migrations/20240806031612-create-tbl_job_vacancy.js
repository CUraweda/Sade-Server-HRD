'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_job_vacancy', {
      id: {
        autoIncrement: true,
        primaryKey: true, 
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      sub_title: {
        allowNull: true,
        type: Sequelize.STRING
      },
      min_academic: {
        allowNull: true,
        type: Sequelize.STRING
      },
      location: {
        allowNull: true,
        type: Sequelize.STRING
      },
      longitude: {
        allowNull: true,
        type: Sequelize.STRING
      },
      latitude: {
        allowNull: true,
        type: Sequelize.STRING
      },
      start_date: {
        allowNull: true,
        type: Sequelize.DATE
      },
      end_date: {
        allowNull: true,
        type: Sequelize.DATE
      },
      max_applicant: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      applicant_count: {
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      notes: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      status: {
        allowNull: true,
        type: Sequelize.STRING
      },
      role: {
        allowNull: true,
        type: Sequelize.STRING
      },
      divison_id: {
        onDelete: "CASCADE",
        references: {
          model: "ref_division",
          key: "id"
        },
        type: Sequelize.INTEGER
      },
      is_fulltime: {
        allowNull: true,
        type: Sequelize.BOOLEAN
      },
      is_open: {
        defaultValue: true,
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable("tbl_job_vacancy")
  }
};
