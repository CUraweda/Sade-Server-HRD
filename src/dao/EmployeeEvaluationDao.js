const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const EmployeeEvaluation = models.employeeevaluation;
const EmployeeJobdesk = models.employeejobdesk;
const JobdeskUnit = models.jobdeskunit
const JobdeskGrade = models.jobdeskgrading
const JobdeskGroupGrade = models.jobdeskgroupgrading

class EmployeeEvaluationDao extends SuperDao {
    constructor() {
        super(EmployeeEvaluation);
    }

    async getCount(filter) {
        let { search } = filter;
        if (!search) search = "";
        return EmployeeEvaluation.count({
            where: {
                [Op.or]: [
                    { academic_year: { [Op.like]: "%" + search + "%" } },
                    { uid: { [Op.like]: "%" + search + "%" } },
                ],
            },
        });
    }

    async getPage(offset, limit, filter) {
        let { search } = filter;
        if (!search) search = "";
        return EmployeeEvaluation.findAll({
            where: {
                [Op.or]: [
                    { academic_year: { [Op.like]: "%" + search + "%" } },
                    { uid: { [Op.like]: "%" + search + "%" } },
                ],
            },
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
        return JobdeskUnit.findOne({
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
                                    required: true
                                }
                            ]
                        }
                    ]
                }
            ]
        })
    }
}

module.exports = EmployeeEvaluationDao;
