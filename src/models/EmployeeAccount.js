'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class EmployeeAccount extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // Define associations here
            this.belongsTo(models.employeesalary, { foreignKey: 'salary_id' });
            this.belongsTo(models.employees, { foreignKey: 'employee_id' });
            this.belongsTo(models.months, { foreignKey: 'month_id' });
            this.hasMany(models.employeebill, { foreignKey: "account_id" })
        }
    }

    EmployeeAccount.init(
        {
            salary_id: DataTypes.INTEGER,
            employee_id: DataTypes.INTEGER,
            month_id: DataTypes.INTEGER,
            year: DataTypes.INTEGER,
            uid: DataTypes.STRING,
            status: DataTypes.STRING,
            is_paid: DataTypes.BOOLEAN,
            paid_amount: DataTypes.DOUBLE,
            temp_total: DataTypes.DOUBLE,
            fixed_salary: DataTypes.DOUBLE,
            variable_salary: DataTypes.DOUBLE,
            loan: DataTypes.DOUBLE,
            cooperative: DataTypes.DOUBLE,
            facility: DataTypes.DOUBLE,
            other_income: DataTypes.DOUBLE,
            other_cut: DataTypes.DOUBLE
        },
        {
            sequelize,
            tableName: 'tbl_employee_account',
            modelName: 'employeeaccount',
            timestamps: true, // Includes created_at and updated_at columns
            underscored: true, // Maps snake_case columns to camelCase properties
        }
    );

    return EmployeeAccount;
};
