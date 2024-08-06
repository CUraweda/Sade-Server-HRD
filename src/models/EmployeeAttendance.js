'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class EmployeeAttendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here
      this.belongsTo(models.worktime, { foreignKey: 'worktime_id' });
      this.belongsTo(models.employees, { foreignKey: 'employee_id' });
    }
  }
  
  EmployeeAttendance.init(
    {
        worktime_id: DataTypes.INTEGER,
        employee_id: DataTypes.INTEGER,
        uid: DataTypes.STRING,
        description: DataTypes.STRING,
        status: DataTypes.STRING,
        is_outstation: DataTypes.BOOLEAN        
    },
    {
      sequelize,
      tableName: 'tbl_employee_attendance',
      modelName: 'employeeattendance',
      timestamps: true, // Includes created_at and updated_at columns
      underscored: true, // Maps snake_case columns to camelCase properties
    }
  );
  
  return EmployeeAttendance;
};
