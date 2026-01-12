'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('tbl_employee_announcement', 'file_path', {
			type: Sequelize.STRING,
			allowNull: true,
		});
		await queryInterface.addColumn('tbl_employee_announcement', 'file_type', {
			type: Sequelize.STRING,
			allowNull: true,
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeColumn('tbl_employee_announcement', 'file_path');
		await queryInterface.removeColumn('tbl_employee_announcement', 'file_type');
	},
};

