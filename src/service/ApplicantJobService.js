const httpStatus = require("http-status");
const ApplicantJobDao = require("../dao/ApplicantJobDao");
const responseHandler = require("../helper/responseHandler");

class ApplicantJobService {
    constructor() {
        this.applicantJobDao = new ApplicantJobDao();
    }

    create = async (body) => {
        const applicantJobData = await this.applicantJobDao.create(body);
        if (!applicantJobData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to create applicant job record");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Applicant job record created successfully", applicantJobData);
    };

    createMany = async (body = []) => {
        const applicantJobData = await this.applicantJobDao.bulkCreate(body);
        if (!applicantJobData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to create applicant job record");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Applicant job record created successfully", applicantJobData);
    };

    update = async (id, body) => {
        const dataExist = await this.applicantJobDao.findById(id);
        if (!dataExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Applicant job record not found");

        const applicantJobData = await this.applicantJobDao.updateWhere(body, { id });
        if (!applicantJobData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to update applicant job record");

        return responseHandler.returnSuccess(httpStatus.OK, "Applicant job record updated successfully", {});
    };

    delete = async (id) => {
        const applicantJobData = await this.applicantJobDao.deleteByWhere({ id });
        if (!applicantJobData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to delete applicant job record");

        return responseHandler.returnSuccess(httpStatus.OK, "Applicant job record deleted successfully", {});
    };

    showPage = async (page, limit, offset, filter) => {
        const totalRows = await this.applicantJobDao.getCount(filter);
        const totalPage = Math.ceil(totalRows / limit);

        const result = await this.applicantJobDao.getPage(offset, limit, filter);

        return responseHandler.returnSuccess(httpStatus.OK, "Applicant job records retrieved successfully", {
            result,
            page,
            limit,
            totalRows,
            totalPage,
        });
    };

    showOne = async (id) => {
        const applicantJobData = await this.applicantJobDao.findById(id);
        if (!applicantJobData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Applicant job record not found");

        return responseHandler.returnSuccess(httpStatus.OK, "Applicant job record found", applicantJobData);
    };
}

module.exports = ApplicantJobService;
