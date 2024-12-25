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
        let { search, type, status, date, division_id, employee_id } = filter
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
                ...(employee_id && { employee_id }),
                ...(division_id && { "$employee.division_id$": division_id }),
                ...(type && { type }),
                ...(status && { status }),
                ...(date && {
                    [Op.or]: [
                        {
                            start_date: {
                                [Op.between]: [date.start_date, date.end_date]
                            }
                        },
                        {
                            end_date: {
                                [Op.between]: [date.start_date, date.end_date]
                            }
                        }
                    ]
                })
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
        let { search, type, status, date, division_id, employee_id, start_date, end_date } = filter
        if (!search) search = ""
        return EmployeeVacation.findAll({
            where: {
                [Op.or]: [
                    {
                        "$employee.full_name$": { [Op.like]: "%" + search + "%" } 
                    },
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
                                [Op.between]: [date.start_date, date.end_date]
                            }
                        },
                        {
                            end_date: {
                                [Op.between]: [date.start_date, date.end_date]
                            }
                        }
                    ]
                }),
                ...(employee_id && { employee_id }),
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

    async getApprovedFromRange(start_date, end_date) {
        return EmployeeVacation.findAll({
            where: {
                [Op.and]: [
                    { start_date: { [Op.lte]: start_date } },
                    { end_date: { [Op.gte]: end_date } },
                ], is_approved: true
            }
        })
    }

    async getRekapByStartEnd(start_date, end_date, filter) {
        const { employee_id, type } = filter
        return EmployeeVacation.findAll({
            where: {
                [Op.and]: [
                    { 
                      [Op.or]: [
                        { start_date: { [Op.between]: [start_date, end_date] } },  // Vacation starts within the range
                        { end_date: { [Op.between]: [start_date, end_date] } },    // Vacation ends within the range
                        { 
                          start_date: { [Op.lte]: start_date },                    // Vacation starts before range
                          end_date: { [Op.gte]: end_date }                         // Vacation ends after range
                        }
                      ] 
                    }
                ],
                is_approved: true,
                ...(employee_id && { employee_id }),
                ...(type && { type: { [Op.in]: type } })
            }
        })
    }
}

module.exports = EmployeeVacationDao;
