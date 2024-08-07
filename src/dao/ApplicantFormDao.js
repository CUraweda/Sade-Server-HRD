const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const ApplicantForm = models.applicantform;

class ApplicantFormDao extends SuperDao {
    constructor() {
        super(ApplicantForm);
    }

    async getCount(filter) {
        const { search } = filter;
        return ApplicantForm.count({
            where: {
                [Op.or]: [
                    {
                        full_name: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        email: { [Op.like]: "%" + search + "%" },
                    },
                ],
            },
        });
    }

    async getPage(offset, limit, filter) {
        const { search } = filter;
        return ApplicantForm.findAll({
            where: {
                [Op.or]: [
                    {
                        full_name: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        email: { [Op.like]: "%" + search + "%" },
                    },
                ],
            },
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
        });
    }
}

module.exports = ApplicantFormDao;
