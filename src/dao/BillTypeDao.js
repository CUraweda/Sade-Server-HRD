const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const BillType = models.billtype;

class BillTypeDao extends SuperDao {
    constructor() {
        super(BillType);
    }

    async getCount(filter) {
         let { search } = filter
        if(!search) search = ""
        return BillType.count({
            where: {
                [Op.or]: [
                    { name: { [Op.like]: "%" + search + "%" } },
                    { is_subtraction: { [Op.like]: "%" + search + "%" } }
                ],
            },
        });
    }

    async getPage(offset, limit, filter) {
         let { search } = filter
        if(!search) search = ""
        return BillType.findAll({
            where: {
                [Op.or]: [
                    { name: { [Op.like]: "%" + search + "%" } },
                    { is_subtraction: { [Op.like]: "%" + search + "%" } }
                ],
            },
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
        });
    }
}

module.exports = BillTypeDao;
