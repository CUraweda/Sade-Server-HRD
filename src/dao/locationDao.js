const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const Locations = models.locations;

class LocationsDao extends SuperDao {
    constructor() {
        super(Locations);
    }

    async getCount(filter) {
        return Locations.count({});
    }

    async getPage(offset, limit, filter) {
        return Locations.findAll({
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
        });
    }
}

module.exports = LocationsDao;
