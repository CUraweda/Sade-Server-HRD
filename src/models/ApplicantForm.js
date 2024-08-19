'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ApplicantForm extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here
      this.belongsTo(models.jobvacancy, { foreignKey: 'vacancy_id' });
      this.belongsTo(models.user, { foreignKey: 'user_id' });
      this.hasMany(models.applicantacademic, { foreignKey: "form_id" })
      this.hasMany(models.applicantunformal, { foreignKey: "form_id" })
      this.hasMany(models.applicantskill, { foreignKey: "form_id" })
      this.hasMany(models.applicantjob, { foreignKey: "form_id" })
      this.hasMany(models.applicantappreciation, { foreignKey: "form_id" })
    }
  }
  
  ApplicantForm.init(
    {
        vacancy_id: DataTypes.INTEGER,
        user_id: DataTypes.INTEGER,
        full_name: DataTypes.STRING,
      email: DataTypes.STRING,
        phone: DataTypes.STRING,
        nik: DataTypes.STRING,
        pob: DataTypes.STRING,
        dob: DataTypes.DATE,
        religion: DataTypes.STRING,
        martial_status: DataTypes.STRING,
        address: DataTypes.TEXT,
        city: DataTypes.STRING,
        applicant_description: DataTypes.TEXT,
        applicant_vision: DataTypes.TEXT,
        applicant_reason: DataTypes.TEXT,
        applicant_question: DataTypes.TEXT,
        status: DataTypes.STRING,
        is_passed: DataTypes.BOOLEAN,
        is_passed_interview: DataTypes.BOOLEAN,
        file_path: DataTypes.STRING        
    },
    {
      sequelize,
      tableName: 'tbl_applicant_form',
      modelName: 'applicantform',
      timestamps: true, // This assumes you have `created_at` and `updated_at` columns
      underscored: true, // Maps snake_case columns to camelCase properties
    }
  );
  
  return ApplicantForm;
};
