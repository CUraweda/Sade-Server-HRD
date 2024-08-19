const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const TrainingSuggestion = models.trainingsuggestion;

class TrainingSuggestionDao extends SuperDao {
    constructor() {
        super(TrainingSuggestion);
    }

    async getCount(filter) {
         let { search, employee_id } = filter
        if(!search) search = ""
        return TrainingSuggestion.count({
            where: {
                [Op.or]: [
                    {
                        title: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        notes: { [Op.like]: "%" + search + "%" },
                    },
                ],
                ...(employee_id && { employee_id })
            },
        });
    }

    async getPage(offset, limit, filter) {
         let { search, employee_id } = filter
        if(!search) search = ""
        return TrainingSuggestion.findAll({
            where: {
                [Op.or]: [
                    {
                        title: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        notes: { [Op.like]: "%" + search + "%" },
                    },
                ],
                ...(employee_id && { employee_id })
            },
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
        });
    }
}

module.exports = TrainingSuggestionDao;
