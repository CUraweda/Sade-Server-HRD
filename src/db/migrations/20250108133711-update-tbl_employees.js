'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("tbl_employees", "is_on_contract", {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    })
    await queryInterface.addColumn("tbl_employees", "contract_end_date", {
      type: Sequelize.DATE,
      allowNull: true
    })
  },
  
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("tbl_employees", "is_on_contract")
    await queryInterface.removeColumn("tbl_employees", "contract_end_date")
  }
};
