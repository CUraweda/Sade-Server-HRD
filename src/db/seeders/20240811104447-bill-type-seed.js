"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("ref_bill_type", [
      {
        name: "Tunjangan",
        is_subtraction: false
      },
      {
        name: "Koperasi",
        is_subtraction: true
      },
      {
        name: "Pinjaman",
        is_subtraction: true
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("ref_bill_type", null, {});
  },
};
