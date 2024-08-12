const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const Employeeaccount = models.employeeaccount;

class EmployeeaccountDao extends SuperDao {
    constructor() {
        super(Employeeaccount);
    }

    async getCount(filter) {
         let { search } = filter
        if(!search) search = ""
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
         let { search } = filter
        if(!search) search = ""
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
            },
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
        });
    }
}

module.exports = EmployeeaccountDao;
