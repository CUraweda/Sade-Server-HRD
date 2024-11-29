const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const EmployeeEvaluation = models.employeeevaluation;
const EmployeeJobdesk = models.employeejobdesk;
const JobdeskUnit = models.jobdeskunit

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

    async getDetail(id){
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
}

module.exports = EmployeeEvaluationDao;
