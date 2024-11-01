'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FormAnnouncementDao extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here
      this.belongsTo(models.employees, { foreignKey: 'employee_id' });
      this.belongsTo(models.employeeannouncement, { foreignKey: 'announcement_id' });
    }
  }

  FormAnnouncementDao.init(
    {
      employee_id: DataTypes.INTEGER,
      announcement_id: DataTypes.INTEGER
    },
    {
      sequelize,
      tableName: 'tbl_employee_form_announcement',
      modelName: 'formannouncement',
      timestamps: false, // No created_at or updated_at columns
      underscored: true, // Maps snake_case columns to camelCase properties
    }
  );

  return FormAnnouncementDao;
};
