const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op, fn, col} = require("sequelize");

const EmployeeJobdesk = models.employeejobdesk;
const Employees = models.employees

class EmployeeJobdeskDao extends SuperDao {
    constructor() {
        super(EmployeeJobdesk);
    }

    async getCount(filter) {
        let { search, employee_id } = filter
        if (!search) search = ""
        return EmployeeJobdesk.count({
            where: {
                [Op.or]: [
                    {
                        employee_id: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        name: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        description: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        priority_label: { [Op.like]: "%" + search + "%" },
                    },
                ],
                ...(employee_id && { employee_id })
            },
        });
    }

    async getPage(offset, limit, filter) {
        let { search, employee_id } = filter
        if (!search) search = ""
        return EmployeeJobdesk.findAll({
            where: {
                [Op.or]: [
                    {
                        employee_id: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        name: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        description: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        priority_label: { [Op.like]: "%" + search + "%" },
                    },
                ],
                ...(employee_id && { employee_id })
            },
            include: [
                {
                    model: Employees,
                    as: "employee",
                    required: false
                },
                {
                    model: Employees,
                    as: "grader",
                    required: false
                },
            ],
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
        });
    }

    async getStartEnd(start, end, filter = {}) {
        return EmployeeJobdesk.findAll({
            where: {
                ...filter,
                finished_at: { [Op.between]: [start, end] }
            }
        })
    }

    async countRawGradeRange(start, end, filter = {}) {
        return EmployeeJobdesk.findAll({
            where: {
                ...filter,
                finished_at: { [Op.between]: [start, end] }
            },
            attributes: [
                [fn("COUNT", col('id')), "count"],
                [fn("SUM", col('grade')), "raw_grade"]
            ]
        });
    }
}


module.exports = EmployeeJobdeskDao;
