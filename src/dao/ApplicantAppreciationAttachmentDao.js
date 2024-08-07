const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const ApplicantAppreciationAttachment = models.appreciationattachment;

class ApplicantAppreciationAttachmentDao extends SuperDao {
    constructor() {
        super(ApplicantAppreciationAttachment);
    }

    async getCount(filter) {
        const { search } = filter;
        return ApplicantAppreciationAttachment.count({
            where: {
                [Op.or]: [
                    {
                        file_name: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        file_type: { [Op.like]: "%" + search + "%" },
                    },
                ],
            },
        });
    }

    async getPage(offset, limit, filter) {
        const { search } = filter;
        return ApplicantAppreciationAttachment.findAll({
            where: {
                [Op.or]: [
                    {
                        file_name: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        file_type: { [Op.like]: "%" + search + "%" },
                    },
                ],
            },
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
        });
    }
}

module.exports = ApplicantAppreciationAttachmentDao;
