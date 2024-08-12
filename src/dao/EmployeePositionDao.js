const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const EmployeePosition = models.employeeposition;

class EmployeePositionDao extends SuperDao {
    constructor() {
        super(EmployeePosition);
    }

    async getCount(filter) {
         let { search } = filter
        if(!search) search = ""
        return EmployeePosition.count({
            where: {
                name: { [Op.like]: "%" + search + "%" }
            }
        });
    }

    async getPage(offset, limit, filter) {
         let { search } = filter
        if(!search) search = ""
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
