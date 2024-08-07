const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const EmployeePosition = models.employeeposition;

class EmployeePositionDao extends SuperDao {
    constructor() {
        super(EmployeePosition);
    }

    async getCount(filter) {
        const { search } = filter;
        return EmployeePosition.count({
            where: {
                name: { [Op.like]: "%" + search + "%" }
            }
        });
    }

    async getPage(offset, limit, filter) {
        const { search } = filter;
        return EmployeePosition.findAll({
            where: {
                name: { [Op.like]: "%" + search + "%" }
            },
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
        });
    }
}

module.exports = EmployeePositionDao;
