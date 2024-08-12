const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const ApplicantAcademic = models.applicantacademic;

class ApplicantAcademicDao extends SuperDao {
    constructor() {
        super(ApplicantAcademic);
    }

    async getCount(filter) {
        let { search } = filter
        if(!search) search = ""        
        return ApplicantAcademic.count({
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
        return ApplicantAcademic.findAll({
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

module.exports = ApplicantAcademicDao;
