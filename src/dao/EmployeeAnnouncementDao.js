const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const EmployeeAnnouncement = models.employeeannouncement;

class EmployeeAnnouncementDao extends SuperDao {
    constructor() {
        super(EmployeeAnnouncement);
    }

    async getCount(filter) {
        const { search } = filter;
        return EmployeeAnnouncement.count({
            where: {
                [Op.or]: [
                    {
                        notes: { [Op.like]: "%" + search + "%" },
                    },
                ],
            },
        });
    }

    async getPage(offset, limit, filter) {
        const { search } = filter;
        return EmployeeAnnouncement.findAll({
            where: {
                [Op.or]: [
                    {
                        notes: { [Op.like]: "%" + search + "%" },
                    },
                ],
            },
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
        });
    }
}

module.exports = EmployeeAnnouncementDao;
