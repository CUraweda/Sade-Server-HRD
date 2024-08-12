const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const JobVacancy = models.jobvacancy;

class JobVacancyDao extends SuperDao {
    constructor() {
        super(JobVacancy);
    }

    async getCount(filter) {
         let { search } = filter
        if(!search) search = ""
        return JobVacancy.count({
            where: {
                [Op.or]: [
                    {
                        title: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        sub_title: { [Op.like]: "%" + search + "%" },
                    },
                ],
            },
        });
    }

    async getPage(offset, limit, filter) {
         let { search } = filter
        if(!search) search = ""
        return JobVacancy.findAll({
            where: {
                [Op.or]: [
                    {
                        title: { [Op.like]: "%" + search + "%" },
                },
                    {
                        sub_title: { [Op.like]: "%" + search + "%" },
                    },
                ],
            },
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
        });
    }
}

module.exports = JobVacancyDao;
