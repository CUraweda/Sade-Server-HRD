'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class TrainingSuggestion extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // Define associations here
            this.belongsTo(models.employees, { foreignKey: 'employee_id' });
            this.belongsTo(models.employees, { foreignKey: 'approver_id' });
        }
    }

    TrainingSuggestion.init(
        {
            employee_id: DataTypes.INTEGER,
            approver_id: DataTypes.INTEGER,
            title: DataTypes.STRING,
            notes: DataTypes.TEXT,
            start_date: DataTypes.DATE,
            end_date: DataTypes.DATE,
            is_approved: DataTypes.BOOLEAN,
            location: DataTypes.STRING
        },
        {
            sequelize,
            tableName: 'tbl_training_suggestion',
            modelName: 'trainingsuggestion',
            timestamps: true, // This assumes you have `created_at` and `updated_at` columns
            underscored: true, // Maps snake_case columns to camelCase properties
        }
    );

    return TrainingSuggestion;
};
