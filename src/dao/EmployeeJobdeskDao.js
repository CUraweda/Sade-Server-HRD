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
        let { search, employee_id, asessor_assigned, partner_assigned } = filter
        if (!search) search = ""
        return EmployeeJobdesk.count({
            where: {
                [Op.or]: [
                    {
                        "$employee.full_name$": { [Op.like]: "%" + search + "%" }
                    },
                ],
                ...(partner_assigned && { partner_ids: { [Op.like]: `%|${partner_assigned.id}|%` } }),
                ...(asessor_assigned && { asessor_ids: { [Op.like]: `%|${asessor_assigned.id}|%` } }),
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
        let { search, employee_id, is_graded, asessor_assigned, partner_assigned } = filter
        if (!search) search = ""
        if (is_graded) is_graded = is_graded != "0" ? true : false
        return EmployeeJobdesk.findAll({
            where: {
                [Op.or]: [
                    {
                        "$employee.full_name$": { [Op.like]: "%" + search + "%" }
                    },
                ],
                ...(partner_assigned && { partner_ids: { [Op.like]: `%|${partner_assigned.id}|%` } }),
                ...(asessor_assigned && { asessor_ids: { [Op.like]: `%|${asessor_assigned.id}|%` } }),
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
                            attributes: ["full_name", "email", "id"],
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

    async checkDataGrade(data) {
        let { id, employee, identifier } = data
        switch (identifier) {
            case "PARTNER":
                identifier = { partner_ids: { [Op.like]: `|${employee.id}|` } }
                break
            case "SUPERVISOR":
                identifier = { asessor_ids: { [Op.like]: `|${employee.id}|` } }
                break
            default:
                identifier = { employee_id: employee.id }
                break
        }
        console
        return EmployeeJobdesk.findOne({
            where: { id, ...identifier }, include: [
                {
                    as: "employee",
                    model: Employees,
                    required: false
                }
            ]
        })
    }

    // async getStartEnd(start, end, filter = {}) {
    //     return EmployeeJobdesk.findAll({
    //         where: {
    //             ...filter,
    //             finished_at: { [Op.between]: [start, end] }
    //         }
    //     })
    // }

    // async countRawGradeRange(start, end, filter = {}) {
    //     return EmployeeJobdesk.findAll({
    //         where: {
    //             ...filter,
    //             finished_at: { [Op.between]: [start, end] }
    //         },
    //         attributes: [
    //             [fn("COUNT", col('id')), "count"],
    //             [fn("SUM", col('grade')), "raw_grade"]
    //         ]
    //     });
    // }
}


module.exports = EmployeeJobdeskDao;
