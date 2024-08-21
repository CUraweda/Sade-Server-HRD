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
            division_id: DataTypes.INTEGER,
            weekday_id: DataTypes.INTEGER,
            uid: DataTypes.STRING,
            type: DataTypes.ENUM("MASUK", "KELUAR"),
            start_time: DataTypes.TIME,
            end_time: DataTypes.TIME
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
