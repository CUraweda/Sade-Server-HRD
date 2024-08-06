'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ApplicantAcademic extends Model {
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

    ApplicantAcademic.init(
        {
            form_id: DataTypes.INTEGER,
            degree: DataTypes.STRING,
            city: DataTypes.STRING,
            institution: DataTypes.STRING,
            description: DataTypes.TEXT,
            is_kuliah: DataTypes.BOOLEAN,
            start_date: DataTypes.DATE,
            end_date: DataTypes.DATE
        },
        {
            sequelize,
            tableName: 'tbl_applicant_academic',
            modelName: 'applicantacademic',
            timestamps: true, // This assumes you have `created_at` and `updated_at` columns
            underscored: true, // Maps snake_case columns to camelCase properties
        }
    );

    return ApplicantAcademic;
};
