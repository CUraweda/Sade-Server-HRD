'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class EmployeeJobdesk extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // Define associations here
            this.belongsTo(models.employees, { foreignKey: 'employee_id', as: "employee" });
            this.belongsTo(models.employees, { foreignKey: 'grader_id', as: "grader" });
            this.belongsTo(models.employees, { foreignKey: 'partner_id', as: "partner" });
            this.belongsTo(models.jobdeskunit, { foreignKey: 'unit_id'});
            this.belongsTo(models.jobdeskgroupgrading, { foreignKey: 'grading_id' });
            this.belongsTo(models.jobdeskgrading, { foreignKey: 'choosen_grade_id' });
            this.belongsTo(models.employeeevaluation, { foreignKey: 'evaluation_id'});
            this.belongsTo(models.evaluationitems, { foreignKey: 'evaluation_items_id'});
            this.belongsTo(models.division, { foreignKey: 'division_id'});
        }
    }

    EmployeeJobdesk.init(
        {
            employee_id: DataTypes.INTEGER,
            grader_id: DataTypes.INTEGER,
            partner_id: DataTypes.INTEGER,
            name: DataTypes.STRING,
            description: DataTypes.TEXT,
            asessor_ids: DataTypes.STRING,
            partner_ids: DataTypes.STRING,
            status: DataTypes.STRING,
            uid: DataTypes.STRING,
            personal_grade: DataTypes.INTEGER,
            personal_grade_at: DataTypes.DATE,
            partner_grade: DataTypes.INTEGER,
            partner_grade_at: DataTypes.DATE,
            assesor_grade: DataTypes.INTEGER,
            assesor_grade_at: DataTypes.DATE,
            overall_grade_raw: DataTypes.INTEGER,
            overall_grade: DataTypes.STRING,
            grading_id: DataTypes.INTEGER,
            choosen_grade_id: DataTypes.INTEGER,
            unit_id: DataTypes.INTEGER,
            evaluation_id: DataTypes.INTEGER,
            evaluation_items_id: DataTypes.INTEGER,
            division_id: DataTypes.INTEGER,
        },
        {
            sequelize,
            tableName: 'tbl_employee_jobdesk',
            modelName: 'employeejobdesk',
            timestamps: true, // Includes created_at and updated_at columns
            underscored: true, // Maps snake_case columns to camelCase properties
        }
    );

    return EmployeeJobdesk;
};
