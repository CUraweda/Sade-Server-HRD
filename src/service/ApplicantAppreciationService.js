const httpStatus = require("http-status");
const ApplicantAppreciationDao = require("../dao/ApplicantAppreciationDao");
const responseHandler = require("../helper/responseHandler");

class ApplicantAppreciationService {
    constructor() {
        this.applicantAppreciationDao = new ApplicantAppreciationDao();
    }

    create = async (body) => {
        const applicantAppreciationData = await this.applicantAppreciationDao.create(body);
        if (!applicantAppreciationData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to create applicant appreciation record");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Applicant appreciation record created successfully", applicantAppreciationData);
    };

    update = async (id, body) => {
        const dataExist = await this.applicantAppreciationDao.findById(id);
        if (!dataExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Applicant appreciation record not found");

        const applicantAppreciationData = await this.applicantAppreciationDao.updateWhere(body, { id });
        if (!applicantAppreciationData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to update applicant appreciation record");

        return responseHandler.returnSuccess(httpStatus.OK, "Applicant appreciation record updated successfully", {});
    };

    delete = async (id) => {
        const applicantAppreciationData = await this.applicantAppreciationDao.deleteByWhere({ id });
        if (!applicantAppreciationData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to delete applicant appreciation record");

        return responseHandler.returnSuccess(httpStatus.OK, "Applicant appreciation record deleted successfully", {});
    };

    showPage = async (page, limit, offset, filter) => {
        const totalRows = await this.applicantAppreciationDao.getCount(filter);
        const totalPage = Math.ceil(totalRows / limit);

        const result = await this.applicantAppreciationDao.getPage(offset, limit, filter);

        return responseHandler.returnSuccess(httpStatus.OK, "Applicant appreciation records retrieved successfully", {
            result,
            page,
            limit,
            totalRows,
            totalPage,
        });
    };

    showOne = async (id) => {
        const applicantAppreciationData = await this.applicantAppreciationDao.findById(id);
        if (!applicantAppreciationData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Applicant appreciation record not found");

        return responseHandler.returnSuccess(httpStatus.OK, "Applicant appreciation record found", applicantAppreciationData);
    };
}

module.exports = ApplicantAppreciationService;
