'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust the path according to your setup

module.exports = (sequelize, DataTypes) => {
    class EmployeeBill extends Model { 
        static associate(models) {
            // Define associations here
            this.belongsTo(models.employeeaccount, { foreignKey: 'account_id' });
            this.belongsTo(models.billtype, { foreignKey: 'type_id' });
        }
    }

    EmployeeBill.init({
        account_id: DataTypes.INTEGER,
        type_id: DataTypes.INTEGER,
        description: DataTypes.STRING,
        amount: DataTypes.DOUBLE
    }, {
        sequelize,
        modelName: 'employeebill',
        tableName: 'tbl_employee_bill',
        timestamps: true, // This will automatically manage created_at and updated_at columns
        underscored: true // Maps camelCase columns to snake_case properties
    });

    return EmployeeBill;
};
