const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const Employeeaccount = models.employeeaccount;

class EmployeeaccountDao extends SuperDao {
    constructor() {
        super(Employeeaccount);
    }

    async getCount(filter) {
        let { search, this_month } = filter
        if (!search) search = ""
        return Employeeaccount.count({
            where: {
                [Op.or]: [
                    { salary_id: { [Op.like]: "%" + search + "%" } },
                    { employee_id: { [Op.like]: "%" + search + "%" } },
                    { month_id: { [Op.like]: "%" + search + "%" } },
                    { year: { [Op.like]: "%" + search + "%" } },
                    { uid: { [Op.like]: "%" + search + "%" } },
                    { status: { [Op.like]: "%" + search + "%" } },
                    { is_paid: { [Op.like]: "%" + search + "%" } },
                    { temp_total: { [Op.like]: "%" + search + "%" } },
                    { fixed_salary: { [Op.like]: "%" + search + "%" } },
                    { variable_salary: { [Op.like]: "%" + search + "%" } },
                    { loan: { [Op.like]: "%" + search + "%" } },
                    { cooperative: { [Op.like]: "%" + search + "%" } },
                ],
            },
        });
    }

    async getPage(offset, limit, filter) {
        let { search, this_month } = filter
        if (!search) search = ""
        const currentDate = new Date()
        const currentMonth = currentDate.getMonth() + 1
        const currentYear = currentDate.getFullYear()

        return Employeeaccount.findAll({
            where: {
                [Op.or]: [
                    { salary_id: { [Op.like]: "%" + search + "%" } },
                    { employee_id: { [Op.like]: "%" + search + "%" } },
                    { month_id: { [Op.like]: "%" + search + "%" } },
                    { year: { [Op.like]: "%" + search + "%" } },
                    { uid: { [Op.like]: "%" + search + "%" } },
                    { status: { [Op.like]: "%" + search + "%" } },
                    { is_paid: { [Op.like]: "%" + search + "%" } },
                    { temp_total: { [Op.like]: "%" + search + "%" } },
                    { fixed_salary: { [Op.like]: "%" + search + "%" } },
                    { variable_salary: { [Op.like]: "%" + search + "%" } },
                    { loan: { [Op.like]: "%" + search + "%" } },
                    { cooperative: { [Op.like]: "%" + search + "%" } },
                ],
                ...(this_month === "Y" && {
                    month_id: currentMonth,
                    year: currentYear
                })
            },
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
        });
    }

    async getTotalRange(year, month_id) {
        return Employeeaccount.findAll({
            where: { month_id, year, is_paid: false },
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

module.exports = EmployeeaccountDao;
