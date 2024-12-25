const httpStatus = require("http-status");
const JobdeskGroupGradeDao = require("../dao/JobdeskGroupGradeDao");
const responseHandler = require("../helper/responseHandler");

class JobdeskGroupGradeService {
    constructor() {
        this.jobdeskGroupGradeDao = new JobdeskGroupGradeDao();
    }

    create = async (body) => {
        const jobdeskGroupGradeData = await this.jobdeskGroupGradeDao.create(body);
        if (!jobdeskGroupGradeData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to create jobdesk group grade");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Jobdesk group grade created successfully", jobdeskGroupGradeData);
    };

    createMany = async (body = []) => {
        const jobdeskGroupGradeData = await this.jobdeskGroupGradeDao.bulkCreate(body);
        if (!jobdeskGroupGradeData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to create jobdesk group grades");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Jobdesk group grades created successfully", jobdeskGroupGradeData);
    };

    update = async (id, body) => {
        const dataExist = await this.jobdeskGroupGradeDao.findById(id);
        if (!dataExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Jobdesk group grade not found");

        const jobdeskGroupGradeData = await this.jobdeskGroupGradeDao.updateWhere(body, { id });
        if (!jobdeskGroupGradeData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to update jobdesk group grade");

        return responseHandler.returnSuccess(httpStatus.OK, "Jobdesk group grade updated successfully", {});
    };

    delete = async (id) => {
        const jobdeskGroupGradeData = await this.jobdeskGroupGradeDao.deleteByWhere({ id });
        if (!jobdeskGroupGradeData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to delete jobdesk group grade");

        return responseHandler.returnSuccess(httpStatus.OK, "Jobdesk group grade deleted successfully", {});
    };

    showPage = async (page, limit, offset, filter) => {
        const totalRows = await this.jobdeskGroupGradeDao.getCount(filter);
        const totalPage = Math.ceil(totalRows / limit);

        const result = await this.jobdeskGroupGradeDao.getPage(offset, limit, filter);

        return responseHandler.returnSuccess(httpStatus.OK, "Jobdesk group grades retrieved successfully", {
            result,
            page,
            limit,
            totalRows,
            totalPage,
        });
    };

    showOne = async (id) => {
        const jobdeskGroupGradeData = await this.jobdeskGroupGradeDao.findById(id);
        if (!jobdeskGroupGradeData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Jobdesk group grade not found");

        return responseHandler.returnSuccess(httpStatus.OK, "Jobdesk group grade found", jobdeskGroupGradeData);
    };
}

module.exports = JobdeskGroupGradeService;
