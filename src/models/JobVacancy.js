'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class JobVacancy extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // Define associations here
            this.belongsTo(models.division, { foreignKey: 'division_id' });
            this.hasMany(models.vacancydetail, { foreignKey: "vacancy_id" })
            this.hasMany(models.applicantform, { foreignKey: "vacancy_id" })
        }
    }

    JobVacancy.init(
        {
            title: DataTypes.STRING,
            sub_title: DataTypes.STRING,
            min_academic: DataTypes.STRING,
            location: DataTypes.STRING,
            longitude: DataTypes.STRING,
            latitude: DataTypes.STRING,
            start_date: DataTypes.DATE,
            end_date: DataTypes.DATE,
            notes: DataTypes.TEXT,
            status: DataTypes.STRING,
            role: DataTypes.STRING,
            division_id: DataTypes.INTEGER,
            is_fulltime: DataTypes.BOOLEAN,
            is_open: DataTypes.BOOLEAN,
        },
        {
            sequelize,
            tableName: 'tbl_job_vacancy',
            modelName: 'jobvacancy',
            timestamps: true, // This assumes you have `created_at` and `updated_at` columns
            underscored: true, // Maps snake_case columns to camelCase properties
        }
    );

    return JobVacancy;
};
