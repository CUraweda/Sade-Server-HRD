const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const ApplicantJob = models.applicantjob;

class ApplicantJobDao extends SuperDao {
    constructor() {
        super(ApplicantJob);
    }

    async getCount(filter) {
        const { search } = filter;
        return ApplicantJob.count({
            where: {
                [Op.or]: [
                    {
                        position: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        city: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        company: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        description: { [Op.like]: "%" + search + "%" },
                    },
                ],
            },
        });
    }

    async getPage(offset, limit, filter) {
        const { search } = filter;
        return ApplicantJob.findAll({
            where: {
                [Op.or]: [
                    {
                        position: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        city: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        company: { [Op.like]: "%" + search + "%" },
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
}

module.exports = ApplicantJobDao;
