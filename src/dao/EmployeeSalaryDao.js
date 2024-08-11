const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const EmployeeSalary = models.employeesalary;

class EmployeeSalaryDao extends SuperDao {
    constructor() {
        super(EmployeeSalary);
    }

    async getCount(filter) {
        const { search } = filter
        return EmployeeSalary.count({
            where: {
                [Op.or]: [
                    {
                        fixed_salary: {
                            [Op.like]: "%" + search + "%"
                        }
                    }
                ]
            }
        });
    }

    async getPage(offset, limit, filter) {
        const { search } = filter
        return EmployeeSalary.findAll({
            where: {
                [Op.or]: [
                    {
                        fixed_salary: {
                            [Op.like]: "%" + search + "%"
                        }
                    }
                ]
            },
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
        });
    }
}

module.exports = EmployeeSalaryDao;
