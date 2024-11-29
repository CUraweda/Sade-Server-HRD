const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const EmployeeEvaluationItem = models.evaluationitems;

class EmployeeEvaluationItemDao extends SuperDao {
    constructor() {
        super(EmployeeEvaluationItem);
    }

    async getCount(filter) {
        let { search } = filter;
        if (!search) search = "";
        return EmployeeEvaluationItem.count({
            where: {
                [Op.or]: [
                    { name: { [Op.like]: "%" + search + "%" } },
                    { description: { [Op.like]: "%" + search + "%" } },
                ],
            },
        });
    }

    async getPage(offset, limit, filter) {
        let { search } = filter;
        if (!search) search = "";
        return EmployeeEvaluationItem.findAll({
            where: {
                [Op.or]: [
                    { name: { [Op.like]: "%" + search + "%" } },
                    { description: { [Op.like]: "%" + search + "%" } },
                ],
            },
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
        });
    }
}

module.exports = EmployeeEvaluationItemDao;
