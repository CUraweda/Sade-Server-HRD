'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class BillType extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.hasMany(models.employeebill, { foreignKey: "type_id" })
        }
    }

    BillType.init(
        {
            name: DataTypes.STRING,
            is_subtraction: DataTypes.BOOLEAN
        },
        {
            sequelize,
            tableName: 'ref_bill_type',
            modelName: 'billtype',
        }
    );

    return BillType;
};
