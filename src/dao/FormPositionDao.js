const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const FormPosition = models.formposition;

class FormPositionDao extends SuperDao {
    constructor() {
        super(FormPosition);
    }

    async getCount(filter) {
        const { employee_id } = filter
        return FormPosition.count({
            where: {
                ...(employee_id && employee_id)
            }
        });
    }

    async getPage(offset, limit, filter) {
        const { employee_id } = filter
        return FormPosition.findAll({
            where: {
                ...(employee_id && employee_id)
            },
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
        });
    }
}

module.exports = FormPositionDao;
