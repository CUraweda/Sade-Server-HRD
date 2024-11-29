'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class EmployeeEvaluation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here
      this.belongsTo(models.employees, { foreignKey: 'employee_id' });
      this.belongsTo(models.division, { foreignKey: 'division_id' });
      this.hasMany(models.employeejobdesk, { foreignKey: 'evaluation_id' });
    }
  }
  
  EmployeeEvaluation.init(
    {
        employee_id: DataTypes.INTEGER,
        month_start: DataTypes.INTEGER,
        month_end: DataTypes.INTEGER,
        academic_year: DataTypes.STRING,
        uid: DataTypes.STRING,
        is_done: DataTypes.BOOLEAN,
        file_path: DataTypes.STRING,
        division_id: DataTypes.INTEGER
    },
    {
      sequelize,
    tableName: 'tbl_employee_evaluation',
      modelName: 'employeeevaluation',
      timestamps: false,
      underscored: true, // Maps snake_case columns to camelCase properties
    }
  );
  
  return EmployeeEvaluation;
};
