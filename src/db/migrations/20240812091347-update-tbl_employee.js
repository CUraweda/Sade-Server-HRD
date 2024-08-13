'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("tbl_employees", "is_outstation", {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("tbl_employees", "is_outstation")
  }
};
