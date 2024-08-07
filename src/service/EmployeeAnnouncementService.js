const httpStatus = require("http-status");
const EmployeeAnnouncementDao = require("../dao/EmployeeAnnouncementDao");
const responseHandler = require("../helper/responseHandler");

class EmployeeAnnouncementService {
    constructor() {
        this.employeeAnnouncementDao = new EmployeeAnnouncementDao();
    }

    create = async (body) => {
        const employeeAnnouncementData = await this.employeeAnnouncementDao.create(body);
        if (!employeeAnnouncementData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Announcement Gagal dibuat");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Employee Announcement Berhasil dibuat", employeeAnnouncementData);
    };

    update = async (id, body) => {
        const dataExist = await this.employeeAnnouncementDao.findById(id);
        if (!dataExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Announcement Tidak Ada");

        const employeeAnnouncementData = await this.employeeAnnouncementDao.updateWhere(body, { id });
        if (!employeeAnnouncementData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Announcement Gagal diperbaharui");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Employee Announcement Berhasil diperbaharui", {});
    };

    delete = async (id) => {
        const employeeAnnouncementData = await this.employeeAnnouncementDao.deleteByWhere({ id });
        if (!employeeAnnouncementData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Announcement Gagal dihapus");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Employee Announcement Berhasil dihapus", {});
    };

    showPage = async (page, limit, offset, filter) => {
        const totalRows = await this.employeeAnnouncementDao.getCount(filter);
        const totalPage = Math.ceil(totalRows / limit);

        const result = await this.employeeAnnouncementDao.getPage(offset, limit, filter);

        return responseHandler.returnSuccess(httpStatus.OK, "Data Employee Announcement Berhasil diambil",
            {
                result, page, limit,
                totalRows: totalRows,
                totalPage: totalPage,
            }
        );
    };

    showOne = async (id) => {
        const employeeAnnouncementData = await this.employeeAnnouncementDao.findById(id);
        if (!employeeAnnouncementData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Announcement Tidak ditemukan");

        return responseHandler.returnSuccess(httpStatus.OK, "Data Employee Announcement Ditemukan", employeeAnnouncementData);
    };
}

module.exports = EmployeeAnnouncementService;
