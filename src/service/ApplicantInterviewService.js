const httpStatus = require("http-status");
const ApplicantInterviewDao = require("../dao/ApplicantInterviewDao");
const responseHandler = require("../helper/responseHandler");

class ApplicantInterviewService {
    constructor() {
        this.applicantInterviewDao = new ApplicantInterviewDao();
    }

    create = async (body) => {
        const applicantInterviewData = await this.applicantInterviewDao.create(body);
        if (!applicantInterviewData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to create applicant academic record");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Applicant academic record created successfully", applicantInterviewData);
    };

    createMany = async (body = []) => {
        const applicantInterviewData = await this.applicantInterviewDao.bulkCreate(body)
        if (!applicantInterviewData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to create applicant academic record");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Applicant academic record created successfully", applicantInterviewData);
    }

    update = async (id, body) => {
        const dataExist = await this.applicantInterviewDao.findById(id);
        if (!dataExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Applicant academic record not found");

        const applicantInterviewData = await this.applicantInterviewDao.updateWhere(body, { id });
        if (!applicantInterviewData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to update applicant academic record");

        return responseHandler.returnSuccess(httpStatus.OK, "Applicant academic record updated successfully", {});
    };

    delete = async (id) => {
        const applicantInterviewData = await this.applicantInterviewDao.deleteByWhere({ id });
        if (!applicantInterviewData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to delete applicant academic record");

        return responseHandler.returnSuccess(httpStatus.OK, "Applicant academic record deleted successfully", {});
    };

    showPage = async (page, limit, offset, filter) => {
        const totalRows = await this.applicantInterviewDao.getCount(filter);
        const totalPage = Math.ceil(totalRows / limit);

        const result = await this.applicantInterviewDao.getPage(offset, limit, filter);

        return responseHandler.returnSuccess(httpStatus.OK, "Applicant academic records retrieved successfully", {
            result,
            page,
            limit,
            totalRows,
            totalPage,
        });
    };

    showOne = async (id) => {
        const applicantInterviewData = await this.applicantInterviewDao.findById(id);
        if (!applicantInterviewData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Applicant academic record not found");

        return responseHandler.returnSuccess(httpStatus.OK, "Applicant academic record found", applicantInterviewData);
    };
}

module.exports = ApplicantInterviewService;
