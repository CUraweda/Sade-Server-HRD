const httpStatus = require("http-status");
const EmployeeAttachmentDao = require("../dao/EmployeeAttachmentDao");
const responseHandler = require("../helper/responseHandler");

class EmployeeAttachmentService {
    constructor() {
        this.employeeAttachmentDao = new EmployeeAttachmentDao();
    }

    create = async (body) => {
        const employeeAttachmentData = await this.employeeAttachmentDao.create(body);
        if (!employeeAttachmentData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Attachment Gagal dibuat");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Employee Attachment Berhasil dibuat", employeeAttachmentData);
    };

    update = async (id, body) => {
        const dataExist = await this.employeeAttachmentDao.findById(id);
        if (!dataExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Attachment Tidak Ada");

        const employeeAttachmentData = await this.employeeAttachmentDao.updateWhere(body, { id });
        if (!employeeAttachmentData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Attachment Gagal diperbaharui");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Employee Attachment Berhasil diperbaharui", {});
    };

    delete = async (id) => {
        const employeeAttachmentData = await this.employeeAttachmentDao.deleteByWhere({ id });
        if (!employeeAttachmentData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Attachment Gagal dihapus");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Employee Attachment Berhasil dihapus", {});
    };

    showPage = async (page, limit, offset, filter) => {
        const totalRows = await this.employeeAttachmentDao.getCount(filter);
        const totalPage = Math.ceil(totalRows / limit);

        const result = await this.employeeAttachmentDao.getPage(offset, limit, filter);

        return responseHandler.returnSuccess(httpStatus.OK, "Data Employee Attachment Berhasil diambil",
            {
                result, page, limit,
                totalRows: totalRows,
                totalPage: totalPage,
            }
        );
    };

    showOne = async (id) => {
        const employeeAttachmentData = await this.employeeAttachmentDao.findById(id);
        if (!employeeAttachmentData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Attachment Tidak ditemukan");

        return responseHandler.returnSuccess(httpStatus.OK, "Data Employee Attachment Ditemukan", employeeAttachmentData);
    };
}

module.exports = EmployeeAttachmentService;
