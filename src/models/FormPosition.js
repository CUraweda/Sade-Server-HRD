'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class FormPosition extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.belongsTo(models.employeeposition, { foreignKey: "position_id" })
            this.belongsTo(models.employees, { foreignKey: "employee_id" })
        }
    }

    FormPosition.init(
        {
            position_id: DataTypes.INTEGER,
            employee_id: DataTypes.INTEGER,
            is_active: DataTypes.BOOLEAN
        },
        {
            sequelize,
            tableName: 'ref_employee_position',
            modelName: 'formposition',
        }
    );

    return FormPosition;
};
