const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const EmployeeEvaluationItem = models.evaluationitems;
const Division = models.division
const JobdeskUnit = models.jobdeskunit

class EmployeeEvaluationItemDao extends SuperDao {
    constructor() {
        super(EmployeeEvaluationItem);
    }

    async getCount(filter) {
        let { search, division_id } = filter;
        if (!search) search = "";
        return EmployeeEvaluationItem.count({
            where: {
                ...(division_id && { division_id }),
                [Op.or]: [
                    { name: { [Op.like]: "%" + search + "%" } },
                    { description: { [Op.like]: "%" + search + "%" } },
                ],
            },
        });
    }

    async getPage(offset, limit, filter) {
        let { search,  division_id } = filter;
        if (!search) search = "";
        return EmployeeEvaluationItem.findAll({
            where: {
                ...(division_id && { division_id }),
                [Op.or]: [
                    { name: { [Op.like]: "%" + search + "%" } },
                    { description: { [Op.like]: "%" + search + "%" } },
                ],
            },
            include: [
                {
                    model: Division, 
                    required: false
                },
                {
                    model: JobdeskUnit,
                    required: false
                }
            ],
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
        });
    }

    async getForCalculate(division_id) {
        return EmployeeEvaluationItem.findAll({
            where: { division_id }
        })
    }
}

module.exports = EmployeeEvaluationItemDao;
