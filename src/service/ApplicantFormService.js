const httpStatus = require("http-status");
const ApplicantFormDao = require("../dao/ApplicantFormDao");
const responseHandler = require("../helper/responseHandler");

class ApplicantFormService {
    constructor() {
        this.applicantFormDao = new ApplicantFormDao();
    }

    create = async (body) => {
        const applicantFormData = await this.applicantFormDao.create(body);
        if (!applicantFormData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to create applicant form");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Applicant form created successfully", applicantFormData);
    };

    update = async (id, body) => {
        const dataExist = await this.applicantFormDao.findById(id);
        if (!dataExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Applicant form not found");

        const applicantFormData = await this.applicantFormDao.updateWhere(body, { id });
        if (!applicantFormData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to update applicant form");

        return responseHandler.returnSuccess(httpStatus.OK, "Applicant form updated successfully", {});
    };

    delete = async (id) => {
        const applicantFormData = await this.applicantFormDao.deleteByWhere({ id });
        if (!applicantFormData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to delete applicant form");

        return responseHandler.returnSuccess(httpStatus.OK, "Applicant form deleted successfully", {});
    };

    showPage = async (page, limit, offset, filter) => {
        const totalRows = await this.applicantFormDao.getCount(filter);
        const totalPage = Math.ceil(totalRows / limit);

        const result = await this.applicantFormDao.getPage(offset, limit, filter);

        return responseHandler.returnSuccess(httpStatus.OK, "Applicant forms retrieved successfully", {
            result,
            page,
            limit,
            totalRows,
            totalPage,
        });
    };

    showOne = async (id) => {
        const applicantFormData = await this.applicantFormDao.findById(id);
        if (!applicantFormData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Applicant form not found");

        return responseHandler.returnSuccess(httpStatus.OK, "Applicant form found", applicantFormData);
    };
}

module.exports = ApplicantFormService;
