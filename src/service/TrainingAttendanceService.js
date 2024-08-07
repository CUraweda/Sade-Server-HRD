const httpStatus = require("http-status");
const TrainingAttendanceDao = require("../dao/TrainingAttendanceDao");
const responseHandler = require("../helper/responseHandler");

class TrainingAttendanceService {
    constructor() {
        this.trainingAttendanceDao = new TrainingAttendanceDao();
    }

    create = async (body) => {
        const trainingAttendanceData = await this.trainingAttendanceDao.create(body);
        if (!trainingAttendanceData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Training Attendance Gagal dibuat");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Training Attendance Berhasil dibuat", trainingAttendanceData);
    };

    update = async (id, body) => {
        const dataExist = await this.trainingAttendanceDao.findById(id);
        if (!dataExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Training Attendance Tidak Ada");

        const trainingAttendanceData = await this.trainingAttendanceDao.updateWhere(body, { id });
        if (!trainingAttendanceData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Training Attendance Gagal diperbaharui");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Training Attendance Berhasil diperbaharui", {});
    };

    delete = async (id) => {
        const trainingAttendanceData = await this.trainingAttendanceDao.deleteByWhere({ id });
        if (!trainingAttendanceData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Training Attendance Gagal dihapus");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Training Attendance Berhasil dihapus", {});
    };

    showPage = async (page, limit, offset, filter) => {
        const totalRows = await this.trainingAttendanceDao.getCount(filter);
        const totalPage = Math.ceil(totalRows / limit);

        const result = await this.trainingAttendanceDao.getPage(offset, limit, filter);

        return responseHandler.returnSuccess(httpStatus.OK, "Data Training Attendance Berhasil diambil",
            {
                result, page, limit,
                totalRows: totalRows,
                totalPage: totalPage,
            }
        );
    };

    showOne = async (id) => {
        const trainingAttendanceData = await this.trainingAttendanceDao.findById(id);
        if (!trainingAttendanceData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Training Attendance Tidak ditemukan");

        return responseHandler.returnSuccess(httpStatus.OK, "Data Training Attendance Ditemukan", trainingAttendanceData);
    };
}

module.exports = TrainingAttendanceService;
