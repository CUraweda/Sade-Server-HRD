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
        }
    }

    EmployeeJobdesk.init(
        {
            employee_id: DataTypes.INTEGER,
            grader_id: DataTypes.INTEGER,
            name: DataTypes.STRING,
            description: DataTypes.TEXT,
            due_date: DataTypes.DATE,
            priority: DataTypes.INTEGER,
            priority_label: DataTypes.STRING,
            is_finish: DataTypes.BOOLEAN,
            finished_at: DataTypes.DATE,
            is_graded: DataTypes.BOOLEAN,
            graded_at: DataTypes.DATE,
            grade: DataTypes.INTEGER,
            asessor_ids: DataTypes.STRING
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
