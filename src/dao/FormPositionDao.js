const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const FormPosition = models.formposition;

class FormPositionDao extends SuperDao {
    constructor() {
        super(FormPosition);
    }

    async getCount(filter) {
        return FormPosition.count({
            where: filter
        });
    }

    async getPage(offset, limit, filter) {
        return FormPosition.findAll({
            where: filter,
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
        });
    }
}

module.exports = FormPositionDao;
