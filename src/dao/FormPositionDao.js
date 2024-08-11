const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const FormPosition = models.formposition;

class FormPositionDao extends SuperDao {
    constructor() {
        super(FormPosition);
    }

    async getCount(filter) {
        return FormPosition.count({});
    }

    async getPage(offset, limit, filter) {
        return FormPosition.findAll({
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
        });
    }
}

module.exports = FormPositionDao;
