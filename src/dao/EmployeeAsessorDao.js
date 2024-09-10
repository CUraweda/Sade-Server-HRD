const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const Employees = models.employees;

class EmployeesDao extends SuperDao {
    constructor() {
        super(Employees);
    }

    async getCount(filter) {
        let { search, only_asessor } = filter
        only_asessor = only_asessor != "1" ? false : true
        if (!search) search = ""
        return Employees.count({
            where: {
                ...(only_asessor && { is_asessor: true })
                // name: { [Op.like]: "%" + search + "%" }
            }
        });
    }

    async getPage(offset, limit, filter) {
        let { search, only_asessor } = filter
        only_asessor = only_asessor != "1" ? false : true
        if (!search) search = ""
        return Employees.findAll({
            where: {
                ...(only_asessor && { is_asessor: true })
                // name: { [Op.like]: "%" + search + "%" }
            },
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
        });
    }
}

module.exports = EmployeesDao;
