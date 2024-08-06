'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_training_attendance', {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      training_id: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "tbl_training",
          key: "id"
        }
      },
      title: {
        allowNull: true,
        type: Sequelize.STRING
      },
      img_path: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      longitude: {
        allowNull: true,
        type: Sequelize.STRING
      },
      latitude: {
        allowNull: true,
        type: Sequelize.STRING
      },
      description: {
        allowNull: true,
        type: Sequelize.TEXT 
      },
      day_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: "ref_weekday",
          key: "id"
        }
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
    await queryInterface.dropTable("tbl_training_attendance")
  }
};
