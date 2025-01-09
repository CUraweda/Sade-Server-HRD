"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("tbl_employee_evaluation", "tbl_employee_evaluation_ibfk_17");
    await queryInterface.removeConstraint("tbl_employees", "tbl_employees_current_evaluation_id_foreign_idx");
    await queryInterface.removeConstraint("tbl_employee_jobdesk", "tbl_employee_jobdesk_ibfk_61");
    await queryInterface.addConstraint("tbl_employee_evaluation", {
      fields: ["employee_id"],
      type: "foreign key",
      name: "tbl_employee_evaluation_ibfk_17",
      references: {
        table: "tbl_employees",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

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

    await queryInterface.addConstraint("tbl_employee_jobdesk", {
      fields: ["employee_id"],
      type: "foreign key",
      name: "tbl_employee_jobdesk_ibfk_61",
      references: {
        table: "tbl_employees",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("tbl_employee_evaluation", "tbl_employee_evaluation_ibfk_17");
    await queryInterface.removeConstraint("tbl_employees","tbl_employees_current_evaluation_id_foreign_idx");
    await queryInterface.removeConstraint("tbl_employee_jobdesk","tbl_employee_jobdesk_ibfk_61");
    await queryInterface.addConstraint("tbl_employee_evaluation", {
      fields: ["employee_id"],
      type: "foreign key",
      name: "tbl_employee_evaluation_ibfk_17", 
      references: {
        table: "tbl_employees",
        field: "id",
      },
      onDelete: "NO ACTION",
      onUpdate: "CASCADE",
    });

    await queryInterface.addConstraint("tbl_employees", {
      fields: ["current_evaluation_id"],
      type: "foreign key",
      name: "tbl_employees_current_evaluation_id_foreign_idx", 
      references: {
        table: "tbl_employee_evaluation",
        field: "id",
      },
      onDelete: "NO ACTION",
      onUpdate: "CASCADE",
    });

    await queryInterface.addConstraint("tbl_employee_jobdesk", {
      fields: ["employee_id"],
      type: "foreign key",
      name: "tbl_employee_jobdesk_ibfk_61",
      references: {
        table: "tbl_employees",
        field: "id",
      },
      onDelete: "NO ACTION",
      onUpdate: "CASCADE",
    });
  },
};
