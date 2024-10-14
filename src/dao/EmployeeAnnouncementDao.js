const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const EmployeeAnnouncement = models.employeeannouncement;
const FormAnnouncement = models.formannouncement

class EmployeeAnnouncementDao extends SuperDao {
    constructor() {
        super(EmployeeAnnouncement);
    }

    async getCount(filter) {
        let { search, is_specific, employee_id } = filter
        if (!search) search = ""
        return EmployeeAnnouncement.count({
            where: {
                [Op.or]: [
                    {
                        notes: { [Op.like]: "%" + search + "%" },
                    },
                ],
                ...(is_specific && { is_specific }),
            },
            include: [
                {
                    model: FormAnnouncement,
                    ...(employee_id && {
                        where: { employee_id },
                        required: true
                    })
                }
            ],
        });
    }

    async getPage(offset, limit, filter) {
        let { search, is_specific, employee_id } = filter
        if (!search) search = ""
        return EmployeeAnnouncement.findAll({
            where: {
                [Op.or]: [
                    {
                        notes: { [Op.like]: "%" + search + "%" },
                    },
                ],
                ...(is_specific != null && { is_specific }),
            },
            ...(employee_id && {
                include: [
                    {
                        model: FormAnnouncement,
                        where: { employee_id },
                        required: true
                    }
                ]
            }),
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
        });
    }
}

module.exports = EmployeeAnnouncementDao;
