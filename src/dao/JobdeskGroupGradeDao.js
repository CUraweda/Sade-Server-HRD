const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const JobdeskGroupGrade = models.jobdeskgroupgrading;

class JobdeskGroupGradeDao extends SuperDao {
    constructor() {
        super(JobdeskGroupGrade);
    }

    async getCount(filter) {
        let { search } = filter;
        if (!search) search = "";
        return JobdeskGroupGrade.count({
            where: {
                [Op.or]: [
                    { identifier: { [Op.like]: "%" + search + "%" } },
                ],
            },
        });
    }

    async getPage(offset, limit, filter) {
        let { search } = filter;
        if (!search) search = "";
        return JobdeskGroupGrade.findAll({
            where: {
                [Op.or]: [
                    { identifier: { [Op.like]: "%" + search + "%" } },
                ],
            },
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
        });
    }
}

module.exports = JobdeskGroupGradeDao;
