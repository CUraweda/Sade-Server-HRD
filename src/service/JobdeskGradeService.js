const httpStatus = require("http-status");
const JobdeskGradeDao = require("../dao/JobdeskGradeDao");
const responseHandler = require("../helper/responseHandler");

class JobdeskGradeService {
    constructor() {
        this.jobdeskGradeDao = new JobdeskGradeDao();
    }

    create = async (body) => {
        const jobdeskGradeData = await this.jobdeskGradeDao.create(body);
        if (!jobdeskGradeData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to create jobdesk grade");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Jobdesk grade created successfully", jobdeskGradeData);
    };

    createMany = async (body = []) => {
        const jobdeskGradeData = await this.jobdeskGradeDao.bulkCreate(body);
        if (!jobdeskGradeData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to create jobdesk grades");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Jobdesk grades created successfully", jobdeskGradeData);
    };

    update = async (id, body) => {
        const dataExist = await this.jobdeskGradeDao.findById(id);
        if (!dataExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Jobdesk grade not found");

        const jobdeskGradeData = await this.jobdeskGradeDao.updateWhere(body, { id });
        if (!jobdeskGradeData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to update jobdesk grade");

        return responseHandler.returnSuccess(httpStatus.OK, "Jobdesk grade updated successfully", {});
    };

    delete = async (id) => {
        const jobdeskGradeData = await this.jobdeskGradeDao.deleteByWhere({ id });
        if (!jobdeskGradeData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to delete jobdesk grade");

        return responseHandler.returnSuccess(httpStatus.OK, "Jobdesk grade deleted successfully", {});
    };

    showPage = async (page, limit, offset, filter) => {
        const totalRows = await this.jobdeskGradeDao.getCount(filter);
        const totalPage = Math.ceil(totalRows / limit);

        const result = await this.jobdeskGradeDao.getPage(offset, limit, filter);

        return responseHandler.returnSuccess(httpStatus.OK, "Jobdesk grades retrieved successfully", {
            result,
            page,
            limit,
            totalRows,
            totalPage,
        });
    };

    showOne = async (id) => {
        const jobdeskGradeData = await this.jobdeskGradeDao.findById(id);
        if (!jobdeskGradeData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Jobdesk grade not found");

        return responseHandler.returnSuccess(httpStatus.OK, "Jobdesk grade found", jobdeskGradeData);
    };
}

module.exports = JobdeskGradeService;
