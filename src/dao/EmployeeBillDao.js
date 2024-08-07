const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const EmployeeBill = models.employeebill;

class EmployeeBillDao extends SuperDao {
    constructor() {
        super(EmployeeBill);
    }

    async getCount(filter) {
        const { search } = filter;
        return EmployeeBill.count({
            where: {
                [Op.or]: [
                    { description: { [Op.like]: "%" + search + "%" } },
                    { amount: { [Op.like]: "%" + search + "%" } }
                ],
            },
        });
    }

    async getPage(offset, limit, filter) {
        const { search } = filter;
        return EmployeeBill.findAll({
            where: {
                [Op.or]: [
                    { description: { [Op.like]: "%" + search + "%" } },
                    { amount: { [Op.like]: "%" + search + "%" } }
                ],
            },
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
        });
    }
}

module.exports = EmployeeBillDao;