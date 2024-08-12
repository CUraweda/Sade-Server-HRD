'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Division extends Model {
        static associate(models) {
            this.hasMany(models.jobvacancy, { foreignKey: 'division_id' })
        }
    }
    Division.init(
        {
            name: DataTypes.STRING,
            color: DataTypes.STRING,
        },
        {
            sequelize,
            tableName: 'ref_division',
            modelName: 'division',
            underscored: true,
            timestamps: false
        }
    );
    return Division;
};
