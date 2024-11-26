'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class JobdeskGroupGrade extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here
      this.belongsTo(models.jobdeskunit, { foreignKey: 'unit_id' });
    }
  }
  
  JobdeskGroupGrade.init(
    {
        identifier: DataTypes.STRING,
        unit_id: DataTypes.INTEGER,
        disabled: DataTypes.BOOLEAN
    },
    {
      sequelize,
      tableName: 'tbl_jobdesk_group_grading',
      modelName: 'jobdeskgroupgrading',
      timestamps: false,
      underscored: true, // Maps snake_case columns to camelCase properties
    }
  );
  
  return JobdeskGroupGrade;
};
