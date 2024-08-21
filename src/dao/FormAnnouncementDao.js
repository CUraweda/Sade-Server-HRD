const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const FormAnnouncement = models.formannouncement;
const Employee = models.employees
const EmployeeAnnouncement = models.employeeannouncement

class FormAnnouncementDao extends SuperDao {
    constructor() {
        super(FormAnnouncement);
    }

    async getCount(filter) {
        let { search } = filter
        if (!search) search = ""
        return FormAnnouncement.count({
            where: {
                [Op.or]: [
                    {
                        employee_id: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        announcement_id: { [Op.like]: "%" + search + "%" },
                    },
                ],
            },
        });
    }

    async getPage(offset, limit, filter) {
        let { search } = filter
        if (!search) search = ""
        return FormAnnouncement.findAll({
            where: {
                [Op.or]: [
                    {
                        employee_id: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        announcement_id: { [Op.like]: "%" + search + "%" },
                    },
                ],
            },
            include: [
                {
                    model: Employee,
                    required: false
                },
                {
                    model: EmployeeAnnouncement,
                    required: false
                },
            ],
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
        });
    }
}

module.exports = FormAnnouncementDao;
