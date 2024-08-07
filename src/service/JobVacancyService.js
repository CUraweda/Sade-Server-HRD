const httpStatus = require("http-status");
const JobVacancyDao = require("../dao/JobVacancyDao");
const responseHandler = require("../helper/responseHandler");

class JobVacancyService {
    constructor() {
        this.jobVacancyDao = new JobVacancyDao();
    }

    create = async (body) => {
        const jobVacancyData = await this.jobVacancyDao.create(body);
        if (!jobVacancyData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to create job vacancy");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Job vacancy created successfully", jobVacancyData);
    };

    update = async (id, body) => {
        const dataExist = await this.jobVacancyDao.findById(id);
        if (!dataExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Job vacancy not found");

        const jobVacancyData = await this.jobVacancyDao.updateWhere(body, { id });
        if (!jobVacancyData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to update job vacancy");

        return responseHandler.returnSuccess(httpStatus.OK, "Job vacancy updated successfully", {});
    };

    delete = async (id) => {
        const jobVacancyData = await this.jobVacancyDao.deleteByWhere({ id });
        if (!jobVacancyData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to delete job vacancy");

        return responseHandler.returnSuccess(httpStatus.OK, "Job vacancy deleted successfully", {});
    };

    showPage = async (page, limit, offset, filter) => {
        const totalRows = await this.jobVacancyDao.getCount(filter);
        const totalPage = Math.ceil(totalRows / limit);

        const result = await this.jobVacancyDao.getPage(offset, limit, filter);

        return responseHandler.returnSuccess(httpStatus.OK, "Job vacancies retrieved successfully", {
            result,
            page,
            limit,
            totalRows,
            totalPage,
        });
    };

    showOne = async (id) => {
        const jobVacancyData = await this.jobVacancyDao.findById(id);
        if (!jobVacancyData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Job vacancy not found");

        return responseHandler.returnSuccess(httpStatus.OK, "Job vacancy found", jobVacancyData);
    };
}

module.exports = JobVacancyService;
