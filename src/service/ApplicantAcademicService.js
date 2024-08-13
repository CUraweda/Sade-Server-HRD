const httpStatus = require("http-status");
const ApplicantAcademicDao = require("../dao/ApplicantAcademicDao");
const responseHandler = require("../helper/responseHandler");

class ApplicantAcademicService {
    constructor() {
        this.applicantAcademicDao = new ApplicantAcademicDao();
    }

    create = async (body) => {
        const applicantAcademicData = await this.applicantAcademicDao.create(body);
        if (!applicantAcademicData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to create applicant academic record");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Applicant academic record created successfully", applicantAcademicData);
    };

    createMany = async (body = []) => {
        const applicantAcademicData = await this.applicantAcademicDao.bulkCreate(body)
        if (!applicantAcademicData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to create applicant academic record");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Applicant academic record created successfully", applicantAcademicData);
    }

    update = async (id, body) => {
        const dataExist = await this.applicantAcademicDao.findById(id);
        if (!dataExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Applicant academic record not found");

        const applicantAcademicData = await this.applicantAcademicDao.updateWhere(body, { id });
        if (!applicantAcademicData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to update applicant academic record");

        return responseHandler.returnSuccess(httpStatus.OK, "Applicant academic record updated successfully", {});
    };

    delete = async (id) => {
        const applicantAcademicData = await this.applicantAcademicDao.deleteByWhere({ id });
        if (!applicantAcademicData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to delete applicant academic record");

        return responseHandler.returnSuccess(httpStatus.OK, "Applicant academic record deleted successfully", {});
    };

    showPage = async (page, limit, offset, filter) => {
        const totalRows = await this.applicantAcademicDao.getCount(filter);
        const totalPage = Math.ceil(totalRows / limit);

        const result = await this.applicantAcademicDao.getPage(offset, limit, filter);

        return responseHandler.returnSuccess(httpStatus.OK, "Applicant academic records retrieved successfully", {
            result,
            page,
            limit,
            totalRows,
            totalPage,
        });
    };

    showOne = async (id) => {
        const applicantAcademicData = await this.applicantAcademicDao.findById(id);
        if (!applicantAcademicData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Applicant academic record not found");

        return responseHandler.returnSuccess(httpStatus.OK, "Applicant academic record found", applicantAcademicData);
    };
}

module.exports = ApplicantAcademicService;
