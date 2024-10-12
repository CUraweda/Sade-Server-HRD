const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op, fn, col } = require("sequelize");

const EmployeeJobdesk = models.employeejobdesk;
const Employees = models.employees
const User = models.user

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
                        "$employee.full_name$": { [Op.like]: "%" + search + "%" }
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
        });
    }

    async getPage(offset, limit, filter) {
        let { search, employee_id, is_graded } = filter
        if (!search) search = ""
        if (is_graded) is_graded = is_graded != "0" ? true : false
        return EmployeeJobdesk.findAll({
            where: {
                [Op.or]: [
                    {
                        "$employee.full_name$": { [Op.like]: "%" + search + "%" }
                    },
                ],
                ...(is_graded && { is_graded }),
                ...(employee_id && { employee_id })
            },
            include: [
                {
                    model: Employees,
                    as: "employee",
                    include: [
                        {
                            model: User,
                            required: false
                        }
                    ],
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

    async checkDataGrade(id) {
        return EmployeeJobdesk.findOne({
            where: { id }, include: [
                {
                    as: "employee",
                    model: Employees,
                    required: false
                }
            ]
        })
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
