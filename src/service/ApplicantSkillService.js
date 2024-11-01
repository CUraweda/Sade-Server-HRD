const httpStatus = require("http-status");
const ApplicantSkillDao = require("../dao/ApplicantSkillDao");
const responseHandler = require("../helper/responseHandler");

class ApplicantSkillService {
    constructor() {
        this.applicantSkillDao = new ApplicantSkillDao();
    }

    create = async (body) => {
        const applicantSkillData = await this.applicantSkillDao.create(body);
        if (!applicantSkillData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to create applicant skill record");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Applicant skill record created successfully", applicantSkillData);
    };
    
    createMany = async (body = []) => {
        const applicantSkillData = await this.applicantSkillDao.bulkCreate(body);
        if (!applicantSkillData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to create applicant skill record");
    
        return responseHandler.returnSuccess(httpStatus.CREATED, "Applicant skill record created successfully", applicantSkillData);
    }

    update = async (id, body) => {
        const dataExist = await this.applicantSkillDao.findById(id);
        if (!dataExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Applicant skill record not found");

        const applicantSkillData = await this.applicantSkillDao.updateWhere(body, { id });
        if (!applicantSkillData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to update applicant skill record");

        return responseHandler.returnSuccess(httpStatus.OK, "Applicant skill record updated successfully", {});
    };

    delete = async (id) => {
        const applicantSkillData = await this.applicantSkillDao.deleteByWhere({ id });
        if (!applicantSkillData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to delete applicant skill record");

        return responseHandler.returnSuccess(httpStatus.OK, "Applicant skill record deleted successfully", {});
    };

    showPage = async (page, limit, offset, filter) => {
        const totalRows = await this.applicantSkillDao.getCount(filter);
        const totalPage = Math.ceil(totalRows / limit);

        const result = await this.applicantSkillDao.getPage(offset, limit, filter);

        return responseHandler.returnSuccess(httpStatus.OK, "Applicant skill records retrieved successfully", {
            result,
            page,
            limit,
            totalRows,
            totalPage,
        });
    };

    showOne = async (id) => {
        const applicantSkillData = await this.applicantSkillDao.findById(id);
        if (!applicantSkillData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Applicant skill record not found");

        return responseHandler.returnSuccess(httpStatus.OK, "Applicant skill record found", applicantSkillData);
    };
}

module.exports = ApplicantSkillService;
