'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class EmployeeAttachment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here
      this.belongsTo(models.employees, { foreignKey: 'employee_id' });
    }
  }

  EmployeeAttachment.init(
    {
      employee_id: DataTypes.INTEGER,
      description: DataTypes.STRING,
      file_path: DataTypes.STRING,
      file_name: DataTypes.STRING,
      file_type: DataTypes.STRING
    },
    {
      sequelize,
      tableName: 'tbl_employee_attachment',
      modelName: 'employeeattachment',
      timestamps: false, // No created_at or updated_at columns
      underscored: true, // Maps snake_case columns to camelCase properties
    }
  );

  return EmployeeAttachment;
};
