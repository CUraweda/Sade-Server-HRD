const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op, Sequelize } = require("sequelize");

const EmployeeSalary = models.employeesalary;
const Employees = models.employees
const EmployeeAccount = models.employeeaccount

class EmployeeSalaryDao extends SuperDao {
    constructor() {
        super(EmployeeSalary);
    }

    async getRangeWithEmployee(year, month_id) {
        return EmployeeSalary.findAll({
            where: { is_active: true },
            include: [
                {
                    model: EmployeeAccount,
                    where: { year, month_id },
                    required: false,
                },
                {
                    model: Employees,
                    required: true
                }
            ],
        })
    }

    async getCount(filter) {
        let { search } = filter
        if (!search) search = ""
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
        let { search } = filter
        if (!search) search = ""
        return EmployeeSalary.findAll({
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

    async createOneSafe(body) {
        const { employee_id } = body
        const salaryData = await EmployeeSalary.create(body)
        if (!salaryData) return false

        await EmployeeSalary.update(
            { is_active: false },
            { where: { employee_id, is_active: true, id: { [Op.ne]: salaryData.id } } }
        )

        return salaryData
    }
}

module.exports = EmployeeSalaryDao;
