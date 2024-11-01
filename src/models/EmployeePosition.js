'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class EmployeePosition extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        this.hasMany(models.formposition, { foreignKey: "position_id" })
    }
  }
  
  EmployeePosition.init(
    {
        name: DataTypes.STRING
    },
    {
      sequelize,
      tableName: 'ref_employee_position',
      modelName: 'employeeposition',
      timestamps: false
    }
  );
  
  return EmployeePosition;
};
