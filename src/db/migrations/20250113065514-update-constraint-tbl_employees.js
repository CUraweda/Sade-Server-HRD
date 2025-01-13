'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeConstraint("tbl_employee_outstation", "tbl_employee_outstation_ibfk_1");
    await queryInterface.removeConstraint("tbl_applicant_academic", "tbl_applicant_academic_ibfk_1");
    await queryInterface.removeConstraint("tbl_applicant_appreciation", "tbl_applicant_appreciation_ibfk_1");
    await queryInterface.removeConstraint("tbl_applicant_interview", "tbl_applicant_interview_ibfk_21");
    await queryInterface.removeConstraint("tbl_employee_account", "tbl_employee_account_ibfk_26");
    await queryInterface.removeConstraint("tbl_employee_attachment", "tbl_employee_attachment_ibfk_1");
    await queryInterface.removeConstraint("tbl_employee_attendance", "tbl_employee_attendance_ibfk_25");
    await queryInterface.removeConstraint("tbl_employee_salary", "tbl_employee_salary_ibfk_1");
    await queryInterface.removeConstraint("tbl_employee_attendance", "tbl_employee_attendance_ibfk_26");
    await queryInterface.removeConstraint("tbl_applicant_interview", "tbl_applicant_interview_ibfk_22");
    await queryInterface.addConstraint("tbl_employee_outstation", {
      fields: ["employee_id"],
      type: "foreign key",
      name: "tbl_employee_outstation_ibfk_1",
      references: {
        table: "tbl_employees",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    await queryInterface.addConstraint("tbl_applicant_academic", {
      fields: ["form_id"],
      type: "foreign key",
      name: "tbl_applicant_academic_ibfk_1",
      references: {
        table: "tbl_applicant_form",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    await queryInterface.addConstraint("tbl_applicant_appreciation", {
      fields: ["form_id"],
      type: "foreign key",
      name: "tbl_applicant_appreciation_ibfk_1",
      references: {
        table: "tbl_applicant_form",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    await queryInterface.addConstraint("tbl_applicant_interview", {
      fields: ["form_id"],
      type: "foreign key",
      name: "tbl_applicant_interview_ibfk_21",
      references: {
        table: "tbl_applicant_form",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    await queryInterface.addConstraint("tbl_employee_account", {
      fields: ["employee_id"],
      type: "foreign key",
      name: "tbl_employee_account_ibfk_26",
      references: {
        table: "tbl_employees",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    await queryInterface.addConstraint("tbl_employee_attachment", {
      fields: ["employee_id"],
      type: "foreign key",
      name: "tbl_employee_attachment_ibfk_1",
      references: {
        table: "tbl_employees",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    await queryInterface.addConstraint("tbl_employee_attendance", {
      fields: ["employee_id"],
      type: "foreign key",
      name: "tbl_employee_attendance_ibfk_25",
      references: {
        table: "tbl_employees",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    await queryInterface.addConstraint("tbl_employee_salary", {
      fields: ["employee_id"],
      type: "foreign key",
      name: "tbl_employee_salary_ibfk_1",
      references: {
        table: "tbl_employees",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    await queryInterface.addConstraint("tbl_employee_attendance", {
      fields: ["outstation_id"],
      type: "foreign key",
      name: "tbl_employee_attendance_ibfk_26",
      references: {
        table: "tbl_employee_outstation",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    await queryInterface.addConstraint("tbl_applicant_interview", {
      fields: ["interviewer_id"],
      type: "foreign key",
      name: "tbl_applicant_interview_ibfk_22",
      references: {
        table: "tbl_employees",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },
  
  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint("tbl_employee_outstation", "tbl_employee_outstation_ibfk_1");
    await queryInterface.removeConstraint("tbl_applicant_academic", "tbl_applicant_academic_ibfk_1");
    await queryInterface.removeConstraint("tbl_applicant_appreciation", "tbl_applicant_appreciation_ibfk_1");
    await queryInterface.removeConstraint("tbl_applicant_interview", "tbl_applicant_interview_ibfk_21");
    await queryInterface.removeConstraint("tbl_employee_account", "tbl_employee_account_ibfk_26");
    await queryInterface.removeConstraint("tbl_employee_attachment", "tbl_employee_attachment_ibfk_1");
    await queryInterface.removeConstraint("tbl_employee_attendance", "tbl_employee_attendance_ibfk_25");
    await queryInterface.removeConstraint("tbl_employee_salary", "tbl_employee_salary_ibfk_1");
    await queryInterface.removeConstraint("tbl_employee_attendance", "tbl_employee_attendance_ibfk_26");
    await queryInterface.removeConstraint("tbl_applicant_interview", "tbl_applicant_interview_ibfk_22");
    await queryInterface.addConstraint("tbl_employee_outstation", {
      fields: ["employee_id"],
      type: "foreign key",
      name: "tbl_employee_outstation_ibfk_1", 
      references: {
        table: "tbl_employees",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    await queryInterface.addConstraint("tbl_applicant_academic", {
      fields: ["form_id"],
      type: "foreign key",
      name: "tbl_applicant_academic_ibfk_1",
      references: {
        table: "tbl_applicant_form",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    await queryInterface.addConstraint("tbl_applicant_appreciation", {
      fields: ["form_id"],
      type: "foreign key",
      name: "tbl_applicant_appreciation_ibfk_1",
      references: {
        table: "tbl_applicant_form",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    await queryInterface.addConstraint("tbl_applicant_interview", {
      fields: ["form_id"],
      type: "foreign key",
      name: "tbl_applicant_interview_ibfk_21",
      references: {
        table: "tbl_applicant_form",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    await queryInterface.addConstraint("tbl_employee_account", {
      fields: ["employee_id"],
      type: "foreign key",
      name: "tbl_employee_account_ibfk_26",
      references: {
        table: "tbl_employees",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    await queryInterface.addConstraint("tbl_employee_attachment", {
      fields: ["employee_id"],
      type: "foreign key",
      name: "tbl_employee_attachment_ibfk_1",
      references: {
        table: "tbl_employees",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    await queryInterface.addConstraint("tbl_employee_attendance", {
      fields: ["employee_id"],
      type: "foreign key",
      name: "tbl_employee_attendance_ibfk_25",
      references: {
        table: "tbl_employees",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    await queryInterface.addConstraint("tbl_employee_salary", {
      fields: ["employee_id"],
      type: "foreign key",
      name: "tbl_employee_salary_ibfk_1",
      references: {
        table: "tbl_employees",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    await queryInterface.addConstraint("tbl_employee_attendance", {
      fields: ["outstation_id"],
      type: "foreign key",
      name: "tbl_employee_attendance_ibfk_26",
      references: {
        table: "tbl_employee_outstation",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    await queryInterface.addConstraint("tbl_applicant_interview", {
      fields: ["interviewer_id"],
      type: "foreign key",
      name: "tbl_applicant_interview_ibfk_22",
      references: {
        table: "tbl_employees",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }
};
