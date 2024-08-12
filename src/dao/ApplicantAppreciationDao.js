const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const ApplicantAppreciation = models.applicantappreciation;

class ApplicantAppreciationDao extends SuperDao {
    constructor() {
        super(ApplicantAppreciation);
    }

    async getCount(filter) {
        let { search } = filter
        if(!search) search = ""      
        return ApplicantAppreciation.count({
            where: {
                [Op.or]: [
                    {
                        date: { [Op.like]: "%" + search + "%" },
                    },
                ],
            },
        });
    }

    async getPage(offset, limit, filter) {
        let { search } = filter
        if(!search) search = ""      
        return ApplicantAppreciation.findAll({
            where: {
                [Op.or]: [
                    {
                        date: { [Op.like]: "%" + search + "%" },
                    },
                ],
            },
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
        });
    }
}

module.exports = ApplicantAppreciationDao;
