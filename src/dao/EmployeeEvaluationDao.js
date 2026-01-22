const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const Employees = models.employees
const EmployeeEvaluation = models.employeeevaluation;
const EmployeeJobdesk = models.employeejobdesk;
const JobdeskUnit = models.jobdeskunit
const JobdeskGrade = models.jobdeskgrading
const JobdeskGroupGrade = models.jobdeskgroupgrading
const Division = models.division

class EmployeeEvaluationDao extends SuperDao {
    constructor() {
        super(EmployeeEvaluation);
    }

    async getCount(filter) {
        let { search, month, division, employee } = filter;
        if (!search) search = "";
        return EmployeeEvaluation.count({
            where: {
                ...(month && { month_start: month }),
                ...(division && { division_id: division }),
                ...(employee && { employee_id: employee }),
                [Op.or]: [
                    { academic_year: { [Op.like]: "%" + search + "%" } },
                    { uid: { [Op.like]: "%" + search + "%" } },
                ],
            },
        });
    }

    async getPage(offset, limit, filter) {
        let { search, month, division, employee } = filter;
        if (!search) search = "";
        return EmployeeEvaluation.findAll({
            where: {
                ...(month && { month_start: month }),
                ...(division && { division_id: division }),
                ...(employee && { employee_id: employee }),
                [Op.or]: [
                    { "$employee.full_name$": { [Op.like]: "%" + search + "%" } },
                    { academic_year: { [Op.like]: "%" + search + "%" } },
                    { uid: { [Op.like]: "%" + search + "%" } },
                ],
            },
            include: [
                {
                    model: Employees,
                    required: false
                },
                {
                    model: Division,
                    required: false
                }
            ],
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
        });
    }

    async getDetail(id) {
        return EmployeeEvaluation.findOne({
            where: { id },
            include: [
                {
                    model: Employees,
                    required: false,
                },
                {
                    model: Division,
                    required: false
                },
                {
                    model: EmployeeJobdesk,
                    include: [
                        {
                            model: JobdeskUnit,
                            required: false
                        }
                    ],
                    required: false
                }
            ]
        })
    }

    async getDetailCalculation(id) {
        return JobdeskUnit.findAll({
            where: { disabled: false },
            include: [
                {
                    model: EmployeeJobdesk,
                    required: false,
                    where: { evaluation_id: id },
                    include: [
                        {
                            model: JobdeskGroupGrade,
                            required: true,
                            include: [
                                {
                                    model: JobdeskGrade,
                                    required: false,
                                    order: [["indicator", "DESC"]]
                                }
                            ]
                        },
                    ]
                }
            ]

        })
    }
}

module.exports = EmployeeEvaluationDao;
