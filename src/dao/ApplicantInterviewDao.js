const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const ApplicantInterview = models.applicantinterview;

class ApplicantInterviewDao extends SuperDao {
    constructor() {
        super(ApplicantInterview);
    }

    async getCount(filter) {
        let { search } = filter
        if(!search) search = ""        
        return ApplicantInterview.count({
            where: {
                [Op.or]: [
                    {
                        degree: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        city: { [Op.like]: "%" + search + "%" },
                    },
                ],
            },
        });
    }

    async getPage(offset, limit, filter) {
        let { search } = filter
        if(!search) search = ""        
        return ApplicantInterview.findAll({
            where: {
                [Op.or]: [
                    {
                        degree: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        city: { [Op.like]: "%" + search + "%" },
                    },
                ],
            },
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
        });
    }
}

module.exports = ApplicantInterviewDao;
