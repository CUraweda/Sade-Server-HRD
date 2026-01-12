'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class EmployeeAnnouncement extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.hasMany(models.formannouncement, { foreignKey: "announcement_id" })
        }
    }

    EmployeeAnnouncement.init(
        {
            file_path: DataTypes.STRING,
            file_type: DataTypes.STRING,
            title: DataTypes.STRING,
            plan_date: DataTypes.DATE,
            notes: DataTypes.TEXT,
            is_specific: DataTypes.BOOLEAN
        },
        {
            sequelize,
            tableName: 'tbl_employee_announcement',
            modelName: 'employeeannouncement',
            underscored: true, // Maps snake_case columns to camelCase properties
        }
    );

    return EmployeeAnnouncement;
};
