'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("tbl_worktime", "weekday_id")
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("tbl_worktime", "weekday_id", {
      type: Sequelize.INTEGER,
      onDelete: "CASCADE",
      references: {
        model: "ref_weekday",
        key: "id"
      }
    })
  }
};
