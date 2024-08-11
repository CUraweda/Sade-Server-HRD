"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("ref_division", [
      {
        name: "Keguruan",
        color: "#ffffff",
      },
      {
        name: "Umum",
        color: "#ffffff",
      },
      {
        name: "Litbang",
        color: "#ffffff",
      },
      {
        name: "Special Need Center",
        color: "#ffffff",
      },
      {
        name: "HRD",
        color: "#ffffff",
      },
      {
        name: "Keuangan",
        color: "#ffffff",
      },
      {
        name: "Humanity",
        color: "#ffffff",
      },
      {
        name: "Humas & Marketing",
        color: "#ffffff",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("ref_division", null, {});
  },
};
