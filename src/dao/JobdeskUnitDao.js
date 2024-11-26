const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const JobdeskUnit = models.jobdeskunit;

class JobdeskUnitDao extends SuperDao {
    constructor() {
        super(JobdeskUnit);
    }

    async getCount(filter) {
        let { search } = filter;
        if (!search) search = "";
        return JobdeskUnit.count({
            where: {
                [Op.or]: [
                    { name: { [Op.like]: "%" + search + "%" } },
                ],
            },
        });
    }

    async getPage(offset, limit, filter) {
        let { search } = filter;
        if (!search) search = "";
        return JobdeskUnit.findAll({
            where: {
                [Op.or]: [
                    { name: { [Op.like]: "%" + search + "%" } },
                ],
            },
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
        });
    }
}

module.exports = JobdeskUnitDao;
