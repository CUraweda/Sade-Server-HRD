'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn("tbl_job_vacancy", "max_applicant")
    await queryInterface.removeColumn("tbl_job_vacancy", "applicant_count")
  },
  
  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn("tbl_job_vacancy", "max_applicant", {
      defaultValue: 0,
      type: Sequelize.INTEGER
    })
    await queryInterface.addColumn("tbl_job_vacancy", "applicant_count", {
      defaultValue: 0,
      type: Sequelize.INTEGER
    })
  }
};
