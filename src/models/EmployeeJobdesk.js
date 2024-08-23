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
            this.belongsTo(models.employees, { foreignKey: 'employee_id' });
        }
    }

    EmployeeJobdesk.init(
        {
            employee_id: DataTypes.INTEGER,
            name: DataTypes.STRING,
            description: DataTypes.TEXT,
            due_date: DataTypes.DATE,
            priority: DataTypes.INTEGER,
            priority_label: DataTypes.STRING,
            grade: DataTypes.INTEGER
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
