const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const EmployeeVacation = models.employeevacation;
const Employees = models.employees

class EmployeeVacationDao extends SuperDao {
    constructor() {
        super(EmployeeVacation);
    }

    async getCount(filter) {
        let { search, type, status, date, division_id } = filter
        if (!search) search = ""
        return EmployeeVacation.count({
            where: {
                [Op.or]: [
                    {
                        employee_id: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        approver_id: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        type: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        status: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        description: { [Op.like]: "%" + search + "%" },
                    },
                ],
                ...(date && {
                    [Op.or]: [
                        {
                            start_date: {
                                [Op.startsWith]: date
                            }
                        },
                        {
                            end_date: {
                                [Op.startsWith]: date
                            }
                        },
                    ]
                }),
                ...(division_id && { "$employee.division_id$": division_id }),
                ...(type && { type }),
                ...(status && { status })
            },
            include: [
                {
                    model: Employees,
                    as: "employee",
                    required: false,
                },
                {
                    model: Employees,
                    as: "approver",
                    required: false,
                },
            ]
        });
    }

    async getPage(offset, limit, filter) {
        let { search, type, status, date, division_id } = filter
        if (!search) search = ""
        return EmployeeVacation.findAll({
            where: {
                [Op.or]: [
                    {
                        employee_id: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        approver_id: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        type: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        status: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        description: { [Op.like]: "%" + search + "%" },
                    },
                ],
                ...(date && {
                    [Op.or]: [
                        {
                            start_date: {
                                [Op.startsWith]: date
                            }
                        },
                        {
                            end_date: {
                                [Op.startsWith]: date
                            }
                        },
                    ]
                }),
                ...(division_id && { "$employee.division_id$": division_id }),
                ...(type && { type }),
                ...(status && { status })
            },
            include: [
                {
                    model: Employees,
                    as: "employee",
                    required: false,
                },
                {
                    model: Employees,
                    as: "approver",
                    required: false,
                },
            ],
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
        });
    }
}

module.exports = EmployeeVacationDao;
