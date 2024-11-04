const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const Employeeaccount = models.employeeaccount;
const EmployeeSalary = models.employeesalary
const Employees = models.employees
const BillType = models.billtype
const EmployeeBill = models.employeebill

class EmployeeaccountDao extends SuperDao {
    constructor() {
        super(Employeeaccount);
    }

    async getCount(filter) {
        let { search, year, month } = filter
        if (!search) search = ""
        const currentDate = new Date()
        if (!(year && month)) {
            month = currentDate.getMonth() + 1
            year = currentDate.getFullYear()
        }
        return Employeeaccount.count({
            where: {
                [Op.or]: [
                    {
                        "$employee.full_name$": { [Op.like]: "%" + search + "%" }
                    }
                ],
                ...((year && month) && {
                    month_id: month, year
                })
            },
            include: [
                {
                    model: Employees,
                    required: false
                }
            ]
        });
    }

    async getPage(offset, limit, filter) {
        let { search, year, month } = filter
        if (!search) search = ""
        const currentDate = new Date()
        if (!(year && month)) {
            month = currentDate.getMonth() + 1
            year = currentDate.getFullYear()
        }

        return Employeeaccount.findAll({
            where: {
                [Op.or]: [
                    {
                        "$employee.full_name$": { [Op.like]: "%" + search + "%" }
                    }
                ],
                ...((year && month) && {
                    month_id: month, year
                })
            },
            include: [
                {
                    model: Employees,
                    required: false
                },
                {
                    model: EmployeeSalary,
                    required: false
                },
            ],
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
        });
    }

    async getTotalRange(year, month_id) {
        return Employeeaccount.findAll({
            where: { month_id, year },
            attributes: [
                [models.sequelize.fn('SUM', models.sequelize.col('temp_total')), "total"]
            ]
        })
    }

    async getRange(year, month_id) {
        return Employeeaccount.findAll({
            where: {
                ...(month_id && { month_id }),
                ...(year && { year })
            }
        })
    }

    async getDetail(id) {
        return Employeeaccount.findOne({
            where: { id },
            include: [
                {
                    model: Employees,
                    required: false
                },
                {
                    model: EmployeeBill,
                    include: [
                        {
                            model: BillType,
                            required: false
                        }
                    ],
                    required: false
                }
            ]
        })
    }


    async hardUpdateCounter(id, body) {
        let dataExist = await Employeeaccount.findOne({ where: { id } })
        if (!dataExist) return false

        let { fixed_salary, variable_salary, loan, cooperative, facility, other_cut, other_income } = dataExist
        if (body.hasOwnProperty('fixed_salary')) fixed_salary = body.fixed_salary;
        if (body.hasOwnProperty('variable_salary')) variable_salary = body.variable_salary;
        if (body.hasOwnProperty('loan')) loan = body.loan;
        if (body.hasOwnProperty('cooperative')) cooperative = body.cooperative;
        if (body.hasOwnProperty('facility')) facility = body.facility;
        if (body.hasOwnProperty('other_cut')) other_cut = body.other_cut;
        if (body.hasOwnProperty('other_income')) other_income = body.other_income;

        let payload = {
            temp_total: fixed_salary + variable_salary + facility + other_income - loan - cooperative - other_cut,
            fixed_salary, variable_salary, loan, cooperative, facility, other_cut, other_income
        }
        return Employeeaccount.update(payload, { where: { id } })
    }

    async getActive(employee_id) {
        const currentDate = new Date()
        const currentMonth = currentDate.getMonth() + 1
        const currentYear = currentDate.getFullYear()
        const accounts = await Employeeaccount.findAll({
            where: {
                employee_id,
                month_id: currentMonth,
                year: currentYear
            },
            order: [["id", "DESC"]]
        })
        if (accounts.length < 1) return false
        return accounts[0]
    }
}

module.exports = EmployeeaccountDao
