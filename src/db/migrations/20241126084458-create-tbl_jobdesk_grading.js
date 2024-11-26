'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_jobdesk_grading', {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      grade: {
        type: Sequelize.STRING
      },
      indicator: {
        type: Sequelize.INTEGER
      },
      group_id: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        reference: {
          model: "tbl_jobdesk_group_grading",
          key: "id"
        }
      },
      group_uid: {
        unique: true,
        type: Sequelize.STRING
      },
      indicator_uid: {
        unique: true,
        type: Sequelize.STRING
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("tbl_jobdesk_grading")
  }
};
