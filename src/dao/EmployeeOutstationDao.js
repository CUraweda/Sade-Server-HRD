const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const EmployeeOutstation = models.employeeoutstation;

class EmployeeOutstationDao extends SuperDao {
    constructor() {
        super(EmployeeOutstation);
    }

    async getCount(filter) {
        let { search } = filter
        if (!search) search = ""
        return EmployeeOutstation.count({
            where: {
                name: { [Op.like]: "%" + search + "%" }
            }
        });
    }

    async getPage(offset, limit, filter) {
        let { search } = filter
        if (!search) search = ""
        return EmployeeOutstation.findAll({
            where: {
                name: { [Op.like]: "%" + search + "%" }
            },
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
        });
    }

    async unActiveAllExcept(id) {
        return EmployeeOutstation.update({
            where: { id: { [Op.not]: id }, is_active: true }
        }, { is_active: false })
    }
}

module.exports = EmployeeOutstationDao;
