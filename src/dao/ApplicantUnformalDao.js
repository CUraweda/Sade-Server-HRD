const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const ApplicantUnformal = models.applicantunformal;

class ApplicantUnformalDao extends SuperDao {
    constructor() {
        super(ApplicantUnformal);
    }

    async getCount(filter) {
         let { search } = filter
        if(!search) search = ""
        return ApplicantUnformal.count({
            where: {
                [Op.or]: [
                    {
                        description: { [Op.like]: "%" + search + "%" },
                    },
                ],
            },
        });
    }

    async getPage(offset, limit, filter) {
         let { search } = filter
        if(!search) search = ""
        return ApplicantUnformal.findAll({
            where: {
                [Op.or]: [
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

module.exports = ApplicantUnformalDao;
