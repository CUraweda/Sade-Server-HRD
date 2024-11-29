'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class JobdeskUnit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here
      this.belongsTo(models.division, { foreignKey: 'division_id' });
      this.hasMany(models.employeejobdesk, { foreignKey: "unit_id" })
    }
  }
  
  JobdeskUnit.init(
    {
        name: DataTypes.STRING,
        division_id: DataTypes.INTEGER,
        disabled: DataTypes.BOOLEAN
    },
    {
      sequelize,
      tableName: 'ref_jobdesk_unit',
      modelName: 'jobdeskunit',
      timestamps: false, // This assumes you have `created_at` and `updated_at` columns
      underscored: true, // Maps snake_case columns to camelCase properties
    }
  );
  
  return JobdeskUnit;
};
