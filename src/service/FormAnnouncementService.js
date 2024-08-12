const httpStatus = require("http-status");
const FormAnnouncementDao = require("../dao/FormAnnouncementDao");
const responseHandler = require("../helper/responseHandler");

class EmployeeFormAnnouncementService {
    constructor() {
        this.formAnnouncementDao = new FormAnnouncementDao();
    }

    create = async (body) => {
        const employeeFormAnnouncementData = await this.formAnnouncementDao.create(body);
        if (!employeeFormAnnouncementData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Form Announcement Gagal dibuat");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Employee Form Announcement Berhasil dibuat", employeeFormAnnouncementData);
    };

    update = async (id, body) => {
        const dataExist = await this.formAnnouncementDao.findById(id);
        if (!dataExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Form Announcement Tidak Ada");

        const employeeFormAnnouncementData = await this.formAnnouncementDao.updateWhere(body, { id });
        if (!employeeFormAnnouncementData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Form Announcement Gagal diperbaharui");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Employee Form Announcement Berhasil diperbaharui", {});
    };

    delete = async (id) => {
        const employeeFormAnnouncementData = await this.formAnnouncementDao.deleteByWhere({ id });
        if (!employeeFormAnnouncementData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Form Announcement Gagal dihapus");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Employee Form Announcement Berhasil dihapus", {});
    };

    showPage = async (page, limit, offset, filter) => {
        const totalRows = await this.formAnnouncementDao.getCount(filter);
        const totalPage = Math.ceil(totalRows / limit);

        const result = await this.formAnnouncementDao.getPage(offset, limit, filter);

        return responseHandler.returnSuccess(httpStatus.OK, "Data Employee Form Announcement Berhasil diambil",
            {
                result, page, limit,
                totalRows: totalRows,
                totalPage: totalPage,
            }
        );
    };

    showOne = async (id) => {
        const employeeFormAnnouncementData = await this.formAnnouncementDao.findById(id);
        if (!employeeFormAnnouncementData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Form Announcement Tidak ditemukan");

        return responseHandler.returnSuccess(httpStatus.OK, "Data Employee Form Announcement Ditemukan", employeeFormAnnouncementData);
    };
}

module.exports = EmployeeFormAnnouncementService;
