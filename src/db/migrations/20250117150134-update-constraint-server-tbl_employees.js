"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("tbl_employee_evaluation", "tbl_employee_evaluation_ibfk_1");
    await queryInterface.addConstraint("tbl_employee_evaluation", {
      fields: ["employee_id"],
      type: "foreign key",
      name: "tbl_employee_evaluation_ibfk_1",
      references: {
        table: "tbl_employees",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    
    await queryInterface.removeConstraint("tbl_employees", "tbl_employees_current_evaluation_id_foreign_idx");
    await queryInterface.addConstraint("tbl_employees", {
      fields: ["current_evaluation_id"],
      type: "foreign key",
      name: "tbl_employees_current_evaluation_id_foreign_idx",
      references: {
        table: "tbl_employee_evaluation",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    await queryInterface.removeConstraint("tbl_employee_jobdesk", "tbl_employee_jobdesk_ibfk_1");
    await queryInterface.addConstraint("tbl_employee_jobdesk", {
      fields: ["employee_id"],
      type: "foreign key",
      name: "tbl_employee_jobdesk_ibfk_1",
      references: {
        table: "tbl_employees",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    await queryInterface.removeConstraint("tbl_employee_outstation", "tbl_employee_outstation_ibfk_1");
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
    await queryInterface.removeConstraint("tbl_applicant_academic", "tbl_applicant_academic_ibfk_1");
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
    await queryInterface.removeConstraint("tbl_applicant_appreciation", "tbl_applicant_appreciation_ibfk_1");
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
    await queryInterface.removeConstraint("tbl_applicant_interview", "tbl_applicant_interview_ibfk_1");
    await queryInterface.addConstraint("tbl_applicant_interview", {
      fields: ["form_id"],
      type: "foreign key",
      name: "tbl_applicant_interview_ibfk_1",
      references: {
        table: "tbl_applicant_form",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    await queryInterface.removeConstraint("tbl_employee_account", "tbl_employee_account_ibfk_2");
    await queryInterface.addConstraint("tbl_employee_account", {
      fields: ["employee_id"],
      type: "foreign key",
      name: "tbl_employee_account_ibfk_2",
      references: {
        table: "tbl_employees",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    await queryInterface.removeConstraint("tbl_employee_attachment", "tbl_employee_attachment_ibfk_1");
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
    await queryInterface.removeConstraint("tbl_employee_attendance", "tbl_employee_attendance_ibfk_2");
    await queryInterface.addConstraint("tbl_employee_attendance", {
      fields: ["employee_id"],
      type: "foreign key",
      name: "tbl_employee_attendance_ibfk_2",
      references: {
        table: "tbl_employees",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    await queryInterface.removeConstraint("tbl_employee_salary", "tbl_employee_salary_ibfk_1");
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
    await queryInterface.removeConstraint("tbl_employee_attendance", "tbl_employee_attendance_outstation_id_foreign_idx");
    await queryInterface.addConstraint("tbl_employee_attendance", {
      fields: ["outstation_id"],
      type: "foreign key",
      name: "tbl_employee_attendance_outstation_id_foreign_idx",
      references: {
        table: "tbl_employee_outstation",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    await queryInterface.removeConstraint("tbl_applicant_interview", "tbl_applicant_interview_ibfk_2");
    await queryInterface.addConstraint("tbl_applicant_interview", {
      fields: ["interviewer_id"],
      type: "foreign key",
      name: "tbl_applicant_interview_ibfk_2",
      references: {
        table: "tbl_employees",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("tbl_employee_evaluation", "tbl_employee_evaluation_ibfk_1");
    await queryInterface.addConstraint("tbl_employee_evaluation", {
      fields: ["employee_id"],
      type: "foreign key",
      name: "tbl_employee_evaluation_ibfk_1",
      references: {
        table: "tbl_employees",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    
    await queryInterface.removeConstraint("tbl_employees", "tbl_employees_current_evaluation_id_foreign_idx");
    await queryInterface.addConstraint("tbl_employees", {
      fields: ["current_evaluation_id"],
      type: "foreign key",
      name: "tbl_employees_current_evaluation_id_foreign_idx",
      references: {
        table: "tbl_employee_evaluation",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    await queryInterface.removeConstraint("tbl_employee_jobdesk", "tbl_employee_jobdesk_ibfk_1");
    await queryInterface.addConstraint("tbl_employee_jobdesk", {
      fields: ["employee_id"],
      type: "foreign key",
      name: "tbl_employee_jobdesk_ibfk_1",
      references: {
        table: "tbl_employees",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    await queryInterface.removeConstraint("tbl_employee_outstation", "tbl_employee_outstation_ibfk_1");
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
    await queryInterface.removeConstraint("tbl_applicant_academic", "tbl_applicant_academic_ibfk_1");
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
    await queryInterface.removeConstraint("tbl_applicant_appreciation", "tbl_applicant_appreciation_ibfk_1");
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
    await queryInterface.removeConstraint("tbl_applicant_interview", "tbl_applicant_interview_ibfk_1");
    await queryInterface.addConstraint("tbl_applicant_interview", {
      fields: ["form_id"],
      type: "foreign key",
      name: "tbl_applicant_interview_ibfk_1",
      references: {
        table: "tbl_applicant_form",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    await queryInterface.removeConstraint("tbl_employee_account", "tbl_employee_account_ibfk_2");
    await queryInterface.addConstraint("tbl_employee_account", {
      fields: ["employee_id"],
      type: "foreign key",
      name: "tbl_employee_account_ibfk_2",
      references: {
        table: "tbl_employees",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    await queryInterface.removeConstraint("tbl_employee_attachment", "tbl_employee_attachment_ibfk_1");
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
    await queryInterface.removeConstraint("tbl_employee_attendance", "tbl_employee_attendance_ibfk_2");
    await queryInterface.addConstraint("tbl_employee_attendance", {
      fields: ["employee_id"],
      type: "foreign key",
      name: "tbl_employee_attendance_ibfk_2",
      references: {
        table: "tbl_employees",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    await queryInterface.removeConstraint("tbl_employee_salary", "tbl_employee_salary_ibfk_1");
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
    await queryInterface.removeConstraint("tbl_employee_attendance", "tbl_employee_attendance_outstation_id_foreign_idx");
    await queryInterface.addConstraint("tbl_employee_attendance", {
      fields: ["outstation_id"],
      type: "foreign key",
      name: "tbl_employee_attendance_outstation_id_foreign_idx",
      references: {
        table: "tbl_employee_outstation",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    await queryInterface.removeConstraint("tbl_applicant_interview", "tbl_applicant_interview_ibfk_2");
    await queryInterface.addConstraint("tbl_applicant_interview", {
      fields: ["interviewer_id"],
      type: "foreign key",
      name: "tbl_applicant_interview_ibfk_2",
      references: {
        table: "tbl_employees",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },
};
