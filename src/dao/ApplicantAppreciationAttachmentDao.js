const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const ApplicantAppreciationAttachment = models.appreciationattachment;

class ApplicantAppreciationAttachmentDao extends SuperDao {
    constructor() {
        super(ApplicantAppreciationAttachment);
    }

    async createManyAttach(appreciation_id, files = []) {
        return ApplicantAppreciationAttachment.bulkCreate()
    }

    async getCount(filter) {
        let { search } = filter
        if(!search) search = ""      
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
        let { search } = filter
        if(!search) search = ""      
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
