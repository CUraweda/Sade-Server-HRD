const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const JobdeskGrade = models.jobdeskgrading;

class JobdeskGradeDao extends SuperDao {
    constructor() {
        super(JobdeskGrade);
    }

    async getCount(filter) {
        let { search, group_id } = filter;
        if (!search) search = "";
        return JobdeskGrade.count({
            where: {
                ...(group_id && { group_id }),
                [Op.or]: [
                    { name: { [Op.like]: "%" + search + "%" } },
                    { grade: { [Op.like]: "%" + search + "%" } },
                ],
            },
        });
    }

    async getPage(offset, limit, filter) {
        let { search, group_id } = filter;
        if (!search) search = "";
        return JobdeskGrade.findAll({
            where: {
                ...(group_id && { group_id }),
                [Op.or]: [
                    { name: { [Op.like]: "%" + search + "%" } },
                    { grade: { [Op.like]: "%" + search + "%" } },
                ],
            },
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
        });
    }

    async checkUID(uids){
        const { grade_uid, indicator_uid } = uids
        return Jobdesk.findOne({
            where: {
                ...(grade_uid && {  grade_uid }),
                ...(indicator_uid && {  indicator_uid })
            }
        })
    }
}

module.exports = JobdeskGradeDao;
