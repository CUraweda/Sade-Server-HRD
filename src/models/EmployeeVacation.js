'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class EmployeeVacation extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // Define associations here
            this.belongsTo(models.employees, { foreignKey: 'employee_id', as: "employee" });
            this.belongsTo(models.employees, { foreignKey: 'approver_id', as: "approver" });
        }
    }

    EmployeeVacation.init(
        {
            employee_id: DataTypes.INTEGER,
            approver_id: DataTypes.INTEGER,
            type: DataTypes.STRING,
            status: DataTypes.STRING,
            description: DataTypes.TEXT,
            is_approved: DataTypes.BOOLEAN,
            file_path: DataTypes.STRING,
            start_date: DataTypes.DATE,
            end_date: DataTypes.DATE
        },
        {
            sequelize,
            tableName: 'tbl_employee_vacation',
            modelName: 'employeevacation',
            timestamps: true, // Includes created_at and updated_at columns
            underscored: true, // Maps snake_case columns to camelCase properties
        }
    );

    return EmployeeVacation;
};