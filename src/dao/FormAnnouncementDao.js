const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const FormAnnouncement = models.formannouncement;

class FormAnnouncementDao extends SuperDao {
    constructor() {
        super(FormAnnouncement);
    }

    async getCount(filter) {
         let { search } = filter
        if(!search) search = ""
        return FormAnnouncement.count({
            where: {
                [Op.or]: [
                    {
                        employee_id: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        approver_id: { [Op.like]: "%" + search + "%" },
                    },
                ],
            },
        });
    }

    async getPage(offset, limit, filter) {
         let { search } = filter
        if(!search) search = ""
        return FormAnnouncement.findAll({
            where: {
                [Op.or]: [
                    {
                        employee_id: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        approver_id: { [Op.like]: "%" + search + "%" },
                    },
                ],
            },
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
        });
    }
}

module.exports = FormAnnouncementDao;
