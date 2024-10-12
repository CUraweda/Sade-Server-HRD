const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const EmployeeOutstation = models.employeeoutstation;
const Employees = models.employees

class EmployeeOutstationDao extends SuperDao {
    constructor() {
        super(EmployeeOutstation);
    }

    async getCount(filter) {
        let { search } = filter
        if (!search) search = ""
        return EmployeeOutstation.count({
            where: {
                description: { [Op.like]: "%" + search + "%" }
            }
        });
    }

    async getPage(offset, limit, filter) {
        let { search } = filter
        if (!search) search = ""
        return EmployeeOutstation.findAll({
            where: {
                description: { [Op.like]: "%" + search + "%" }
            },
            include: [
                {
                    model: Employees
                }
            ],
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
        });
    }

    async unActiveAllExcept(id) {
        return EmployeeOutstation.update({ is_active: false }, {
            where: { id: { [Op.not]: id }, is_active: true }
        })
    }
}

module.exports = EmployeeOutstationDao;
