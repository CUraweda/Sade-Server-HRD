const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const Division = models.division;

class DivisionDao extends SuperDao {
    constructor() {
        super(Division);
    }

    async getCount(filter) {
        const { search } = filter
        return Division.count({
            where: {
                [Op.or]: [
                    {
                        name: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        color: { [Op.like]: "%" + search + "%" },
                    },
                ],
            },
        });
    }

    async getPage(offset, limit, filter) {
        const { search } = filter
        return Division.findAll({
            where: {
                [Op.or]: [
                    {
                        name: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        color: { [Op.like]: "%" + search + "%" },
                    },
                ],
            },
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
        });
    }
}

module.exports = DivisionDao;