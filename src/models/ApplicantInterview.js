"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ApplicantInterview extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ApplicantInterview.belongsTo(models.applicantform, { foreignKey: "form_id" })
      ApplicantInterview.belongsTo(models.employees, { foreignKey: "interviewer_id" })
    }
  }
  ApplicantInterview.init(
    {
      form_id: DataTypes.INTEGER,
      interviewer_id: DataTypes.INTEGER,
      plan_date: DataTypes.DATE,
      portal: DataTypes.STRING,
      is_finish: DataTypes.BOOLEAN,
      outcome: DataTypes.ENUM("LULUS", "TIDAK LULUS"),
    },
    {
      sequelize,
      tableName: "tbl_applicant_interview",
      modelName: "applicantInterview",
      underscored: true,
    }
  );
  return ApplicantInterview;
};
