'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class JobVacancyDetail extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // Define associations here
            this.belongsTo(models.jobvacancy, { foreignKey: 'vacancy_id' });
        }
    }

    JobVacancyDetail.init(
        {
            vacancy_id: DataTypes.INTEGER,
            title: DataTypes.STRING,
            description: DataTypes.TEXT
        },
        {
            sequelize,
            tableName: 'tbl_job_vacancy_detail',
            modelName: 'vacancydetail',
            timestamps: true, // This assumes you have `created_at` and `updated_at` columns
            underscored: true, // Maps snake_case columns to camelCase properties
        }
    );

    return JobVacancyDetail;
};
