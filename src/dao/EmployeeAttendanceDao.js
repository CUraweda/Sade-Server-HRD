const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const EmployeeAttendance = models.employeeattendance;

class EmployeeAttendanceDao extends SuperDao {
    constructor() {
        super(EmployeeAttendance);
    }

    async getCount(filter) {
        const { search } = filter;
        return EmployeeAttendance.count({
            where: {
                [Op.or]: [
                    {
                        worktime_id: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        employee_id: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        uid: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        description: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        status: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        is_outstation: { [Op.like]: "%" + search + "%" },
                    },
                ],
            },
        });
    }

    async getPage(offset, limit, filter) {
        const { search } = filter;
        return EmployeeAttendance.findAll({
            where: {
                [Op.or]: [
                    {
                        worktime_id: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        employee_id: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        uid: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        description: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        status: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        is_outstation: { [Op.like]: "%" + search + "%" },
                    },
                ],
            },
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
        });
    }
}

module.exports = EmployeeAttendanceDao;
