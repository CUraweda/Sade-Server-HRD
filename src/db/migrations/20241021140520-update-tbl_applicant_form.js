'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('tbl_applicant_form', 'tbl_applicant_form_employee_id_foreign_idx');

    await queryInterface.addConstraint('tbl_applicant_form', {
      fields: ['employee_id'],
      type: 'foreign key',
      name: 'tbl_applicant_form_employee_id_foreign_idx',
      references: {
        table: 'tbl_employees',
        field: 'id',
      },
      onDelete: 'CASCADE',
    });
  },

  async down (queryInterface, Sequelize) {
    // In the down method, revert the foreign key to the previous state
    await queryInterface.removeConstraint('tbl_applicant_form', 'tbl_applicant_form_employee_id_foreign_idx');

    // Optionally, you can re-add the previous constraint without cascade
    await queryInterface.addConstraint('tbl_applicant_form', {
      fields: ['employee_id'],
      type: 'foreign key',
      name: 'tbl_applicant_form_employee_id_foreign_idx',
      references: {
        table: 'tbl_employees',
        field: 'id',
      },
    });
  }
};
