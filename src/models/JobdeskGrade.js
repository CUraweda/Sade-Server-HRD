'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class JobdeskGrade extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here
      this.belongsTo(models.jobdeskgroupgrading, { foreignKey: 'group_id' });
    }
  }
  
  JobdeskGrade.init(
    {
        name: DataTypes.STRING,
        grade: DataTypes.STRING,
        indicator: DataTypes.INTEGER,
        group_id: DataTypes.INTEGER,
        group_uid: DataTypes.STRING,
        indicator_uid: DataTypes.STRING
    },
    {
      sequelize,
      tableName: 'tbl_jobdesk_grading',
      modelName: 'jobdeskgrading',
      timestamps: false,
      underscored: true, // Maps snake_case columns to camelCase properties
    }
  );
  
  return JobdeskGrade;
};
