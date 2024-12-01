'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("tbl_jobdesk_grading", "grade_uid", {
      type: Sequelize.STRING,
      defaultValue: "",
      unique: true
    })
    await queryInterface.removeColumn("tbl_jobdesk_grading", "group_uid")
  },
  
  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("tbl_jobdesk_grading", "grade_uid")
    await queryInterface.addColumn("tbl_jobdesk_grading", "group_uid", {
      type: Sequelize.STRING,
      defaultValue: "",
      unique: true
    })
  }
};
