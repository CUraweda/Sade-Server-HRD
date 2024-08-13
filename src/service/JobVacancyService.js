const httpStatus = require("http-status");
const JobVacancyDao = require("../dao/JobVacancyDao");
const responseHandler = require("../helper/responseHandler");
const JobVacancyDetailDao = require("../dao/JobVacancyDetailDao");

class JobVacancyService {
    constructor() {
        this.jobVacancyDao = new JobVacancyDao();
        this.jobVacancyDetailDao = new JobVacancyDetailDao()
    }

    create = async (body) => {
        const jobVacancyData = await this.jobVacancyDao.create(body);
        if (!jobVacancyData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to create job vacancy");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Job vacancy created successfully", jobVacancyData);
    };

    createWithDetail = async (body) => {
        let { details } = body
        if (!details || details.length < 1) return responseHandler.returnError(httpStatus.BAD_REQUEST, "No Detail to create");
        delete body.detail

        const jobVacancyData = await this.jobVacancyDao.create(body);
        if (!jobVacancyData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to create job vacancy");

        details = details.map((detail) => ({
            vacancy_id: jobVacancyData.id,
            ...detail
        }))
        const jobVacancyDetailData = await this.jobVacancyDetailDao.bulkCreate(details)
        if (!jobVacancyDetailData) return responseHandler.returnError(httpStatus.OK, "Gagal membuat data detail, namun berhasil membuat data Job Vacancy")

        return responseHandler.returnSuccess(httpStatus.OK, "Berhasil membuat Job Vacancy beserta detail")
    }

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
