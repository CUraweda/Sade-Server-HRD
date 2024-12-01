'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn("tbl_employee_jobdesk", "due_date")
    await queryInterface.removeColumn("tbl_employee_jobdesk", "priority")
    await queryInterface.removeColumn("tbl_employee_jobdesk", "priority_label")
    await queryInterface.removeColumn("tbl_employee_jobdesk", "is_finish")
    await queryInterface.removeColumn("tbl_employee_jobdesk", "finished_at")
    await queryInterface.removeColumn("tbl_employee_jobdesk", "is_graded")
    await queryInterface.removeColumn("tbl_employee_jobdesk", "graded_at")
    await queryInterface.removeColumn("tbl_employee_jobdesk", "grade")
    
    await queryInterface.addColumn("tbl_employee_jobdesk", "status", {
      type: Sequelize.STRING,
      defaultValue: ""
    })
    await queryInterface.addColumn("tbl_employee_jobdesk", "uid", {
      type: Sequelize.STRING,
      unique: true,
      allowNull: true
    })
    await queryInterface.addColumn("tbl_employee_jobdesk", "personal_grade", {
      type: Sequelize.INTEGER,
      defaultValue: 0
    })
    await queryInterface.addColumn("tbl_employee_jobdesk", "partner_grade", {
      type: Sequelize.INTEGER,
      defaultValue: 0
    })
    await queryInterface.addColumn("tbl_employee_jobdesk", "assesor_grade", {
      type: Sequelize.INTEGER,
      defaultValue: 0
    })
    await queryInterface.addColumn("tbl_employee_jobdesk", "personal_graded_at", {
      type: Sequelize.DATE,
      allowNull: true
    })
    await queryInterface.addColumn("tbl_employee_jobdesk", "partner_graded_at", {
      type: Sequelize.DATE,
      allowNull: true
    })
    await queryInterface.addColumn("tbl_employee_jobdesk", "assesor_graded_at", {
      type: Sequelize.DATE,
      allowNull: true
    })
    await queryInterface.addColumn("tbl_employee_jobdesk", "partner_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      onDelete: "CASCADE",
      references: {
        model: "tbl_employees",
        key: "id"
      }
    })
    await queryInterface.addColumn("tbl_employee_jobdesk", "overall_grade_raw", {
      type: Sequelize.INTEGER,
      defaultValue: 0
    })
    await queryInterface.addColumn("tbl_employee_jobdesk", "overall_grade", {
      type: Sequelize.STRING,
      defaultValue: ""
    })
    await queryInterface.addColumn("tbl_employee_jobdesk", "grading_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      onDelete: "CASCADE",
      references: {
        model: "tbl_jobdesk_group_grading",
        key: "id"
      }
    })
    await queryInterface.addColumn("tbl_employee_jobdesk", "choosen_grade_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      onDelete: "CASCADE",
      references: {
        model: "tbl_jobdesk_grading",
        key: "id"
      }
    })
    await queryInterface.addColumn("tbl_employee_jobdesk", "unit_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      onDelete: "CASCADE",
      references: {
        model: "ref_jobdesk_unit",
        key: "id"
      }
    })
    await queryInterface.addColumn("tbl_employee_jobdesk", "evaluation_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      onDelete: "CASCADE",
      references: {
        model: "tbl_employee_evaluation",
        key: "id"
      }
    })
    await queryInterface.addColumn("tbl_employee_jobdesk", "evaluation_items_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      onDelete: "CASCADE",
      references: {
        model: "tbl_employee_evaluation_items",
        key: "id"
      }
    })
    await queryInterface.addColumn("tbl_employee_jobdesk", "division_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      onDelete: "CASCADE",
      references: {
        model: "ref_division",
        key: "id"
      }
    })

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("tbl_employee_jobdesk", "status");
    await queryInterface.removeColumn("tbl_employee_jobdesk", "uid");
    await queryInterface.removeColumn("tbl_employee_jobdesk", "personal_grade");
    await queryInterface.removeColumn("tbl_employee_jobdesk", "partner_grade");
    await queryInterface.removeColumn("tbl_employee_jobdesk", "assesor_grade");
    await queryInterface.removeColumn("tbl_employee_jobdesk", "personal_graded_at");
    await queryInterface.removeColumn("tbl_employee_jobdesk", "partner_graded_at");
    await queryInterface.removeColumn("tbl_employee_jobdesk", "assesor_graded_at");
    await queryInterface.removeColumn("tbl_employee_jobdesk", "partner_id");
    await queryInterface.removeColumn("tbl_employee_jobdesk", "overall_grade_raw");
    await queryInterface.removeColumn("tbl_employee_jobdesk", "overall_grade");
    await queryInterface.removeColumn("tbl_employee_jobdesk", "grading_id");
    await queryInterface.removeColumn("tbl_employee_jobdesk", "choosen_grade_id");
    await queryInterface.removeColumn("tbl_employee_jobdesk", "unit_id");
    await queryInterface.removeColumn("tbl_employee_jobdesk", "evaluation_id");
    await queryInterface.removeColumn("tbl_employee_jobdesk", "evaluation_items_id");
    await queryInterface.removeColumn("tbl_employee_jobdesk", "division_id");

    await queryInterface.addColumn("tbl_employee_jobdesk", "due_date", {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn("tbl_employee_jobdesk", "priority", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn("tbl_employee_jobdesk", "priority_label", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("tbl_employee_jobdesk", "is_finish", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
    await queryInterface.addColumn("tbl_employee_jobdesk", "finished_at", {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn("tbl_employee_jobdesk", "is_graded", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
    await queryInterface.addColumn("tbl_employee_jobdesk", "graded_at", {
      type: Sequelize.DATE,
      allowNull: true
    });
    await queryInterface.addColumn("tbl_employee_jobdesk", "grade", {
      type: Sequelize.INTEGER,
      defaultValue: 0
    });
  }
};
