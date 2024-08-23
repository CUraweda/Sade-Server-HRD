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
        let { search, only_specific, employee_id} = filter
        if (!search) search = ""
        return EmployeeAnnouncement.count({
            where: {
                [Op.or]: [
                    {
                        notes: { [Op.like]: "%" + search + "%" },
                    },
                ],
                ...(only_specific && { is_specific: only_specific === "1" ? true : false }),
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
        let { search, only_specific, employee_id } = filter
        if (!search) search = ""
        return EmployeeAnnouncement.findAll({
            where: {
                [Op.or]: [
                    {
                        notes: { [Op.like]: "%" + search + "%" },
                    },
                ],
                ...(only_specific && { is_specific: only_specific === "1" ? true : false }),
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
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
        });
    }
}

module.exports = EmployeeAnnouncementDao;
