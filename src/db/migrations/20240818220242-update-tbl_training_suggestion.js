'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("tbl_training_suggestion", "start_date", {
      type: Sequelize.DATE,
      allowNull: true,
    })
    await queryInterface.addColumn("tbl_training_suggestion", "end_date", {
      type: Sequelize.DATE,
      allowNull: true,
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("tbl_training_suggestion", "start_date")
    await queryInterface.removeColumn("tbl_training_suggestion", "end_date")
  }
};
