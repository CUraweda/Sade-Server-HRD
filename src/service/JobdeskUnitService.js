const httpStatus = require("http-status");
const JobdeskUnitDao = require("../dao/JobdeskUnitDao");
const responseHandler = require("../helper/responseHandler");

class JobdeskUnitService {
    constructor() {
        this.jobdeskUnitDao = new JobdeskUnitDao();
    }

    create = async (body) => {
        const jobdeskUnitData = await this.jobdeskUnitDao.create(body);
        if (!jobdeskUnitData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to create jobdesk unit");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Jobdesk unit created successfully", jobdeskUnitData);
    };

    createMany = async (body = []) => {
        const jobdeskUnitData = await this.jobdeskUnitDao.bulkCreate(body);
        if (!jobdeskUnitData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to create jobdesk units");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Jobdesk units created successfully", jobdeskUnitData);
    };

update = async (id, body) => {
        const dataExist = await this.jobdeskUnitDao.findById(id);
        if (!dataExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Jobdesk unit not found");

        const jobdeskUnitData = await this.jobdeskUnitDao.updateWhere(body, { id });
        if (!jobdeskUnitData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to update jobdesk unit");

        return responseHandler.returnSuccess(httpStatus.OK, "Jobdesk unit updated successfully", {});
    };

    delete = async (id) => {
        const jobdeskUnitData = await this.jobdeskUnitDao.deleteByWhere({ id });
        if (!jobdeskUnitData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to delete jobdesk unit");

        return responseHandler.returnSuccess(httpStatus.OK, "Jobdesk unit deleted successfully", {});
    };

    showPage = async (page, limit, offset, filter) => {
        const totalRows = await this.jobdeskUnitDao.getCount(filter);
        const totalPage = Math.ceil(totalRows / limit);

        const result = await this.jobdeskUnitDao.getPage(offset, limit, filter);

        return responseHandler.returnSuccess(httpStatus.OK, "Jobdesk units retrieved successfully", {
            result,
            page,
            limit,
            totalRows,
            totalPage,
        });
    };

    showOne = async (id) => {
        const jobdeskUnitData = await this.jobdeskUnitDao.findById(id);
        if (!jobdeskUnitData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Jobdesk unit not found");

        return responseHandler.returnSuccess(httpStatus.OK, "Jobdesk unit found", jobdeskUnitData);
    };
}

module.exports = JobdeskUnitService;
