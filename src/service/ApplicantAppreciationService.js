const httpStatus = require("http-status");
const ApplicantAppreciationDao = require("../dao/ApplicantAppreciationDao");
const responseHandler = require("../helper/responseHandler");
const ApplicantAppreciationAttachmentDao = require("../dao/ApplicantAppreciationAttachmentDao");

class ApplicantAppreciationService {
    constructor() {
        this.applicantAppreciationDao = new ApplicantAppreciationDao();
        this.applicantAppreciationAttachmentDao = new ApplicantAppreciationAttachmentDao()
    }

    create = async (body) => {
        const applicantAppreciationData = await this.applicantAppreciationDao.create(body);
        if (!applicantAppreciationData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to create applicant appreciation record");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Applicant appreciation record created successfully", applicantAppreciationData);
    };

    createMany = async (body) => {
        const applicantAppreciationData = await this.applicantAppreciationDao.bulkCreate(body);
        if (!applicantAppreciationData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to create applicant appreciation record");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Applicant appreciation record created successfully", applicantAppreciationData);
    };

    createManyWithAttachment = async (body) => {
        for(let appreciationData of body){
            const { files } = appreciationData
            if (files.length < 1) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Tidak Ada Attachment Untuk Dibuat")
            const applicantAppreciationData = await this.applicantAppreciationDao.create(appreciationData);
            if (!applicantAppreciationData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to create applicant appreciation record");
    
            for (let fileIndex in files) {
                const fileData = files[fileIndex]
                files[fileIndex] = {
                    appreciation_id: applicantAppreciationData.id,
                    file_name: fileData.filename,
                    file_path: fileData.path,
                    file_type: fileData.mimetype
                }
            }
            const applicantAppreciationAttachmentData = await this.applicantAppreciationAttachmentDao.bulkCreate(files)
            if (!applicantAppreciationAttachmentData) return responseHandler.returnError(httpStatus.OK, "Gagal Membuat Attachment, namun berhasil membuat data Applicant Appreciation")
        }

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
