const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const EmployeeJobdesk = models.employeejobdesk;

class EmployeeJobdeskDao extends SuperDao {
    constructor() {
        super(EmployeeJobdesk);
    }

    async getCount(filter) {
        let { search } = filter
        if (!search) search = ""
        return EmployeeJobdesk.count({
            where: {
                [Op.or]: [
                    {
                        employee_id: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        name: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        description: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        priority_label: { [Op.like]: "%" + search + "%" },
                    },
                ],
            },
        });
    }

    async getPage(offset, limit, filter) {
        let { search } = filter
        if (!search) search = ""
        return EmployeeJobdesk.findAll({
            where: {
                [Op.or]: [
                    {
                        employee_id: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        name: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        description: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        priority_label: { [Op.like]: "%" + search + "%" },
                    },
                ],
            },
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
        });
    }

    async getStartEnd(start, end, filter) {
        const { employee_id } = filter
        return EmployeeJobdesk.findAll({
            where: {
                employee_id,
                [Op.or]: [
                    {

                        created_at: { [Op.between]: [start, end] }
                    },
                    {
                        due_date: { [Op.between]: [start, end] }
                    }
                ]
            }
        })
    }
}

module.exports = EmployeeJobdeskDao;
