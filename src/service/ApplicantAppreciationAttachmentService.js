const httpStatus = require("http-status");
const ApplicantAppreciationAttachmentDao = require("../dao/ApplicantAppreciationAttachmentDao");
const responseHandler = require("../helper/responseHandler");

class ApplicantAppreciationAttachmentService {
    constructor() {
        this.applicantAppreciationAttachmentDao = new ApplicantAppreciationAttachmentDao();
    }

    create = async (body) => {
        const applicantAppreciationAttachmentData = await this.applicantAppreciationAttachmentDao.create(body);
        if (!applicantAppreciationAttachmentData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to create applicant appreciation attachment record");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Applicant appreciation attachment record created successfully", applicantAppreciationAttachmentData);
    };

    update = async (id, body) => {
        const dataExist = await this.applicantAppreciationAttachmentDao.findById(id);
        if (!dataExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Applicant appreciation attachment record not found");

        const applicantAppreciationAttachmentData = await this.applicantAppreciationAttachmentDao.updateWhere(body, { id });
        if (!applicantAppreciationAttachmentData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to update applicant appreciation attachment record");

        return responseHandler.returnSuccess(httpStatus.OK, "Applicant appreciation attachment record updated successfully", {});
    };

    delete = async (id) => {
        const applicantAppreciationAttachmentData = await this.applicantAppreciationAttachmentDao.deleteByWhere({ id });
        if (!applicantAppreciationAttachmentData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to delete applicant appreciation attachment record");

        return responseHandler.returnSuccess(httpStatus.OK, "Applicant appreciation attachment record deleted successfully", {});
    };

    showPage = async (page, limit, offset, filter) => {
        const totalRows = await this.applicantAppreciationAttachmentDao.getCount(filter);
        const totalPage = Math.ceil(totalRows / limit);

        const result = await this.applicantAppreciationAttachmentDao.getPage(offset, limit, filter);

        return responseHandler.returnSuccess(httpStatus.OK, "Applicant appreciation attachment records retrieved successfully", {
            result,
            page,
            limit,
            totalRows,
            totalPage,
        });
    };

    showOne = async (id) => {
        const applicantAppreciationAttachmentData = await this.applicantAppreciationAttachmentDao.findById(id);
        if (!applicantAppreciationAttachmentData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Applicant appreciation attachment record not found");

        return responseHandler.returnSuccess(httpStatus.OK, "Applicant appreciation attachment record found", applicantAppreciationAttachmentData);
    };
}

module.exports = ApplicantAppreciationAttachmentService;
