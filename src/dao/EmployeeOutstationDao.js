const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");
const { required } = require("joi");

const EmployeeOutstation = models.employeeoutstation;
const Employees = models.employees
const Division = models.division
const Worktime = models.worktime

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
                [Op.or]: [
                    { description: { [Op.like]: "%" + search + "%" }},
                    {
                        "$employee.full_name$": { [Op.like]: "%" + search + "%" },
                    },
                ]
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

    async getAllActiveForAutoAttend(){
        return EmployeeOutstation.findAll({
            where: { is_active: true },
            include: [
                {
                    model: Employees,
                    required: true,
                    include: [
                        {
                            model: Division,
                            required: true,
                            include: [
                                {
                                    model: Worktime,
                                    required: true
                                }
                            ]
                        }
                    ]
                }
            ]
        })
    }

    async unActiveAllExcept(id) {
        return EmployeeOutstation.update({ is_active: false }, {
            where: { id: { [Op.not]: id }, is_active: true }
        })
    }
}

module.exports = EmployeeOutstationDao;
