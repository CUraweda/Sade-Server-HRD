'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Training extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // Define associations here
            this.belongsTo(models.employees, { foreignKey: 'employee_id' });
            this.belongsTo(models.employees, { foreignKey: 'proposer_id' });
            this.hasMany(models.trainingattendance, { foreignKey: "training_id" })
        }
    }

    Training.init(
        {
            employee_id: DataTypes.INTEGER,
            proposer_id: DataTypes.INTEGER,
            title: DataTypes.STRING,
            purpose: DataTypes.TEXT,
            status: DataTypes.STRING,
            location: DataTypes.STRING,
            start_date: DataTypes.DATE,
            end_date: DataTypes.DATE
        },
        {
            sequelize,
            tableName: 'tbl_training',
            modelName: 'training',
            timestamps: true, // This assumes you have `created_at` and `updated_at` columns
            underscored: true, // Maps snake_case columns to camelCase properties
        }
    );

    return Training;
};
