const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const ApplicantSkill = models.applicantskill;

class ApplicantSkillDao extends SuperDao {
    constructor() {
        super(ApplicantSkill);
    }

    async getCount(filter) {
         let { search } = filter
        if(!search) search = ""
        return ApplicantSkill.count({
            where: {
                [Op.or]: [
                    {
                        description: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        level: { [Op.like]: "%" + search + "%" },
                    },
                ],
            },
        });
    }

    async getPage(offset, limit, filter) {
         let { search } = filter
        if(!search) search = ""
        return ApplicantSkill.findAll({
            where: {
                [Op.or]: [
                    {
                        description: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        level: { [Op.like]: "%" + search + "%" },
                    },
                ],
            },
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
        });
    }
}

module.exports = ApplicantSkillDao;
