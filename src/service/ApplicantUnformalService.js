const httpStatus = require("http-status");
const ApplicantUnformalDao = require("../dao/ApplicantUnformalDao");
const responseHandler = require("../helper/responseHandler");

class ApplicantUnformalService {
    constructor() {
        this.applicantUnformalDao = new ApplicantUnformalDao();
    }

    create = async (body) => {
        const applicantUnformalData = await this.applicantUnformalDao.create(body);
        if (!applicantUnformalData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to create applicant unformal record");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Applicant unformal record created successfully", applicantUnformalData);
    };

    update = async (id, body) => {
        const dataExist = await this.applicantUnformalDao.findById(id);
        if (!dataExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Applicant unformal record not found");

        const applicantUnformalData = await this.applicantUnformalDao.updateWhere(body, { id });
        if (!applicantUnformalData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to update applicant unformal record");

        return responseHandler.returnSuccess(httpStatus.OK, "Applicant unformal record updated successfully", {});
    };

    delete = async (id) => {
        const applicantUnformalData = await this.applicantUnformalDao.deleteByWhere({ id });
        if (!applicantUnformalData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to delete applicant unformal record");

        return responseHandler.returnSuccess(httpStatus.OK, "Applicant unformal record deleted successfully", {});
    };

    showPage = async (page, limit, offset, filter) => {
        const totalRows = await this.applicantUnformalDao.getCount(filter);
        const totalPage = Math.ceil(totalRows / limit);

        const result = await this.applicantUnformalDao.getPage(offset, limit, filter);

        return responseHandler.returnSuccess(httpStatus.OK, "Applicant unformal records retrieved successfully", {
            result,
            page,
            limit,
            totalRows,
            totalPage,
        });
    };

    showOne = async (id) => {
        const applicantUnformalData = await this.applicantUnformalDao.findById(id);
        if (!applicantUnformalData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Applicant unformal record not found");

        return responseHandler.returnSuccess(httpStatus.OK, "Applicant unformal record found", applicantUnformalData);
    };
}

module.exports = ApplicantUnformalService;
