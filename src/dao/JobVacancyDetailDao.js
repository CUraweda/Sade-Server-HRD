const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const JobVacancyDetail = models.vacancydetail;

class JobVacancyDetailDao extends SuperDao {
    constructor() {
        super(JobVacancyDetail);
    }

    async getCount(filter) {
        let { search } = filter
        if (!search) search = ""
        return JobVacancyDetail.count({
            where: {
                [Op.or]: [
                    {
                        title: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        description: { [Op.like]: "%" + search + "%" },
                    },
                ],
            },
        });
    }

    async getPage(offset, limit, filter) {
        let { search } = filter
        if (!search) search = ""
        return JobVacancyDetail.findAll({
            where: {
                [Op.or]: [
                    {
                        title: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        description: { [Op.like]: "%" + search + "%" },
                    },
                ],
            },
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
        });
    }

    async getByVacancyId(vacancy_id) {
        return JobVacancyDetail.findAll({
            where: { vacancy_id }
        })
    }
}

module.exports = JobVacancyDetailDao;
