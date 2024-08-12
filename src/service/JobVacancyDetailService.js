const httpStatus = require("http-status");
const JobVacancyDetailDao = require("../dao/JobVacancyDetailDao");
const responseHandler = require("../helper/responseHandler");

class JobVacancyDetailService {
    constructor() {
        this.jobVacancyDetailDao = new JobVacancyDetailDao();
    }

    create = async (body) => {
        const jobVacancyDetailData = await this.jobVacancyDetailDao.create(body);
        if (!jobVacancyDetailData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to create job vacancy detail");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Job vacancy detail created successfully", jobVacancyDetailData);
    };

    update = async (id, body) => {
        const dataExist = await this.jobVacancyDetailDao.findById(id);
        if (!dataExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Job vacancy detail not found");

        const jobVacancyDetailData = await this.jobVacancyDetailDao.updateWhere(body, { id });
        if (!jobVacancyDetailData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to update job vacancy detail");

        return responseHandler.returnSuccess(httpStatus.OK, "Job vacancy detail updated successfully", {});
    };

    delete = async (id) => {
        const jobVacancyDetailData = await this.jobVacancyDetailDao.deleteByWhere({ id });
        if (!jobVacancyDetailData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to delete job vacancy detail");

        return responseHandler.returnSuccess(httpStatus.OK, "Job vacancy detail deleted successfully", {});
    };

    showPage = async (page, limit, offset, filter) => {
        const totalRows = await this.jobVacancyDetailDao.getCount(filter);
        const totalPage = Math.ceil(totalRows / limit);

        const result = await this.jobVacancyDetailDao.getPage(offset, limit, filter);

        return responseHandler.returnSuccess(httpStatus.OK, "Job vacancy details retrieved successfully", {
            result,
            page,
            limit,
            totalRows,
            totalPage,
        });
    };

    showOne = async (id) => {
        const jobVacancyDetailData = await this.jobVacancyDetailDao.findById(id);
        if (!jobVacancyDetailData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Job vacancy detail not found");

        return responseHandler.returnSuccess(httpStatus.OK, "Job vacancy detail found", jobVacancyDetailData);
    };
}

module.exports = JobVacancyDetailService;
