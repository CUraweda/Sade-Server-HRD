"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class EmployeeOutstation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        EmployeeOutstation.belongsTo(models.employees, { foreignKey: 'employee_id' });
        // EmployeeOutstation.hasMany(models.employees, { foreignKey: "active_outstation_id" })
    }
  }
  EmployeeOutstation.init(
    {
        employee_id: DataTypes.INTEGER,
        start_date: DataTypes.DATE,
        end_date: DataTypes.DATE,
        is_active: DataTypes.BOOLEAN,
        description: DataTypes.STRING
    },
    {
      sequelize,
      tableName: "tbl_employee_outstation",
      modelName: "employeeoutstation",
      timestamps: true,
      underscored: true,
    }
  );
  return EmployeeOutstation;
};
