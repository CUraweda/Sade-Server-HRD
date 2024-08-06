'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ApplicantUnformal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here
      this.belongsTo(models.applicantform, { foreignKey: 'form_id' });
    }
  }
  
  ApplicantUnformal.init(
    {
        form_id: DataTypes.INTEGER,
        description: DataTypes.TEXT        
    },
    {
      sequelize,
      tableName: 'tbl_applicant_unformal',
      modelName: 'applicantunformal',
      timestamps: true, // This assumes you have `created_at` and `updated_at` columns
      underscored: true, // Maps snake_case columns to camelCase properties
    }
  );
  
  return ApplicantUnformal;
};
