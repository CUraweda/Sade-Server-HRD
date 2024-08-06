'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_applicant_appreciation_attachment', {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      appreciation_id: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "tbl_applicant_appreciation",
          key: "id"
        }
      },
      file_path: {
        allowNull: true,
        type: Sequelize.STRING
      },
      file_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      file_type: {
        allowNull: false,
        type: Sequelize.STRING,
      },
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("tbl_applicant_appreciation_attachment")
  }
};
