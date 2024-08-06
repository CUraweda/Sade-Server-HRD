'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class EmployeeSalary extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.belongsTo(models.employees, { foreignKey: "employee_id" })
            this.hasMany(models.employeeaccount, { foreignKey: "salary_id" })
        }
    }

    EmployeeSalary.init(
        {
            employee_id: DataTypes.INTEGER,
            fixed_salary: DataTypes.DOUBLE,
            is_active: DataTypes.BOOLEAN
        },
        {
            sequelize,
            tableName: 'ref_employee_position',
            modelName: 'employeesalary',
        }
    );

    return EmployeeSalary;
};
