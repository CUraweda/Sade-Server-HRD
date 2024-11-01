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
        });
    }

    async getPage(offset, limit, filter) {
        let { search } = filter
        if(!search) search = ""
        return ApplicantInterview.findAll({
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
        });
    }

    async getByUID(uid){
        return ApplicantInterview.findOne({ where: { uid } })
    }
}

module.exports = ApplicantInterviewDao;
