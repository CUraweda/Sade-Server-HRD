'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class EmployeeEvaluationItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here
      this.belongsTo(models.jobdeskunit, { foreignKey: 'unit_id' });
      this.belongsTo(models.division, { foreignKey: 'division_id' });
      this.belongsTo(models.jobdeskgroupgrading, { foreignKey: 'grading_id' })
    }
  }
  
  EmployeeEvaluationItem.init(
    {
        division_id: DataTypes.INTEGER,
        name: DataTypes.STRING,
        description: DataTypes.TEXT,
        grading_id: DataTypes.INTEGER,
        unit_id: DataTypes.INTEGER
    },
    {
      sequelize,
      tableName: 'tbl_employee_evaluation_items',
      modelName: 'evaluationitems',
      timestamps: false,
      underscored: true, // Maps snake_case columns to camelCase properties
    }
  );
  
  return EmployeeEvaluationItem;
};
