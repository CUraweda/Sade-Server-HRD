const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const EmployeeAttendance = models.employeeattendance;
const Division = models.division
const Employee = models.employees
const Worktime = models.worktime


class EmployeeAttendanceDao extends SuperDao {
    constructor() {
        super(EmployeeAttendance);
    }

    async getCount(filter) {
         let { search } = filter
        if(!search) search = ""
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
         let { search } = filter
        if(!search) search = ""
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
            include: [
                {
                    model: Worktime,
                    required: false
                },
                {
                    model: Employee,
                    required: false,
                    include: [
                        {
                            model: Division,
                            required: false
                        }
                    ]
                },
            ],
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
        });
    }
}

module.exports = EmployeeAttendanceDao;
