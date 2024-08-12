'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TrainingAttendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here
      this.belongsTo(models.training, { foreignKey: 'training_id' });
      this.belongsTo(models.weekday, { foreignKey: 'day_id' });
    }
  }
  
  TrainingAttendance.init(
    {
        training_id: DataTypes.INTEGER,
        title: DataTypes.STRING,
        img_path: DataTypes.TEXT,
        description: DataTypes.TEXT,
        day_id: DataTypes.INTEGER        
    },
    {
      sequelize,
      tableName: 'tbl_training_attendance',
      modelName: 'trainingattendance',
      timestamps: true, // This assumes you have `created_at` and `updated_at` columns
      underscored: true, // Maps snake_case columns to camelCase properties
    }
  );
  
  return TrainingAttendance;
};
