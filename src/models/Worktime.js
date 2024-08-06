'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Worktime extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // Define associations here
            this.belongsTo(models.division, { foreignKey: 'division_id' });
            this.belongsTo(models.weekday, { foreignKey: 'weekday_id' });
            this.hasMany(models.employeeattendance, { foreignKey: "worktime_id" })
        }
    }

    Worktime.init(
        {
            employee_id: DataTypes.INTEGER,
            approver_id: DataTypes.INTEGER,
            type: DataTypes.STRING,
            status: DataTypes.STRING,
            description: DataTypes.TEXT,
            is_approved: DataTypes.BOOLEAN,
            start_date: DataTypes.DATE,
            end_date: DataTypes.DATE
        },
        {
            sequelize,
            tableName: 'tbl_worktime',
            modelName: 'worktime',
            timestamps: true, // Includes created_at and updated_at columns
            underscored: true, // Maps snake_case columns to camelCase properties
        }
    );

    return Worktime;
};
