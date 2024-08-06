'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("ref_bill_type", {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      is_subtraction: {
        type: Sequelize.BOOLEAN
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("ref_bill_type")
  }
};
