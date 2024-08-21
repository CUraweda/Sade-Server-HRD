'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('tbl_training_attendance', 'day_id');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('tbl_training_attendance', 'day_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      onDelete: "CASCADE",
      references: {
        model: "ref_weekday",
        key: "id"
      },
    });
  },
};
