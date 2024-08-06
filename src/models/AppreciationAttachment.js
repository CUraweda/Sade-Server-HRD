'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ApplicantAppreciationAttachment extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // Define associations here
            this.belongsTo(models.applicantappreciation, { foreignKey: 'appreciation_id' });
        }
    }

    ApplicantAppreciationAttachment.init(
        {
            appreciation_id: DataTypes.INTEGER,
            file_path: DataTypes.STRING,
            file_name: DataTypes.STRING,
            file_type: DataTypes.STRING
        },
        {
            sequelize,
            tableName: 'tbl_applicant_appreciation_attachment',
            modelName: 'appreciationattachment',
            timestamps: false, // No `created_at` or `updated_at` columns
            underscored: true, // Maps snake_case columns to camelCase properties
        }
    );

    return ApplicantAppreciationAttachment;
};
