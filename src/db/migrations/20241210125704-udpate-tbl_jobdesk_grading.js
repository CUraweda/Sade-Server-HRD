'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable("tbl_jobdesk_grading");
    if (!tableDescription.grade_uid) {
      await queryInterface.addColumn("tbl_jobdesk_grading", "grade_uid", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
    
    if (!tableDescription.group_id){
      await queryInterface.addColumn("tbl_jobdesk_grading", "group_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "tbl_jobdesk_group_grading",
          key: "id"
        }
      })
    }
  },
  
  async down(queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable("tbl_jobdesk_grading");
    if(tableDescription.grade_uid) await queryInterface.removeColumn("tbl_jobdesk_grading", "grade_uid")
    if(tableDescription.group_id) await queryInterface.removeColumn("tbl_jobdesk_grading", "group_id")
  }
};
