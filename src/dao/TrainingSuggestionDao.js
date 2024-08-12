const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const TrainingSuggestion = models.trainingsuggestion;

class TrainingSuggestionDao extends SuperDao {
    constructor() {
        super(TrainingSuggestion);
    }

    async getCount(filter) {
         let { search } = filter
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
            },
        });
    }

    async getPage(offset, limit, filter) {
         let { search } = filter
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
            },
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
        });
    }
}

module.exports = TrainingSuggestionDao;
