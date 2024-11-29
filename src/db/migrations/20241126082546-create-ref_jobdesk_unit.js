'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('ref_jobdesk_unit', {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      division_id: {
        onDelete: "CASCADE",
        references: {
          model: "ref_division",
          key: "id",
        },
        type: Sequelize.INTEGER
      },
      disabled: {
        defaultValue: false,
        type: Sequelize.BOOLEAN
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("ref_jobdesk_unit")
  }
};
