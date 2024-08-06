'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_worktime', {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      division_id: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "ref_division",
          key: "id"
        }
      },
      weekday_id: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "ref_weekday",
          key: "id"
        }
      },
      uid: {
        allowNull: true,
        unique: true,
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.ENUM("MASUK", "KELUAR")
      },
      start_time: {
        allowNull: true,
        type: Sequelize.TIME
      },
      end_time: {
        allowNull: true,
        type: Sequelize.TIME
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("tbl_worktime")
  }
};
