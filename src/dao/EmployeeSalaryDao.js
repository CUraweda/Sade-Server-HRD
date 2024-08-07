const SuperDao = require("./SuperDao");
const models = require("../models");

const EmployeeSalary = models.employeesalary;

class EmployeeSalaryDao extends SuperDao {
    constructor() {
        super(EmployeeSalary);
    }

    async getCount(filter) {
        return EmployeeSalary.count({
            where: filter
        });
    }

    async getPage(offset, limit, filter) {
        return EmployeeSalary.findAll({
            where: filter,
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
        });
    }
}

module.exports = EmployeeSalaryDao;
