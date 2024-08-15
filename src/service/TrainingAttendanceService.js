const httpStatus = require("http-status");
const TrainingAttendanceDao = require("../dao/TrainingAttendanceDao");
const responseHandler = require("../helper/responseHandler");
const TrainingDao = require("../dao/TrainingDao");

class TrainingAttendanceService {
    constructor() {
        this.trainingAttendanceDao = new TrainingAttendanceDao();
        this.trainingDao = new TrainingDao()
    }

    create = async (body) => {
        const trainingAttendanceData = await this.trainingAttendanceDao.create(body);
        if (!trainingAttendanceData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Training Attendance Gagal dibuat");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Training Attendance Berhasil dibuat", trainingAttendanceData);
    };

    createByToken = async (employee, body, file) => {
        if (!employee) return responseHandler.returnError(httpStatus.UNPROCESSABLE_ENTITY, "Anda tidak terdaftar sebagai karyawan")
        if (!body.training_id) return responseHandler.returnError(httpStatus.UNPROCESSABLE_ENTITY, "Tolong Sertakan ID")
        if (!employee.division_id) return responseHandler.returnError(httpStatus.UNPROCESSABLE_ENTITY, "Anda tidak terdaftar pada divisi apapun")
        if (!file) return responseHandler.returnError(httpStatus.UNPROCESSABLE_ENTITY, "Tidak ada gambar yang disertakan")

        const trainingAttendanceData = await this.trainingAttendanceDao.create({
            employee_id: employee.id,
            ...(file && { img_path: file.path }),
            ...body
        })
        if (!trainingAttendanceData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Training Attendance Gagal dibuat");
    
        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Training Attendance Berhasil dibuat", trainingAttendanceData);
    }

    createByTokenBulk = async (employee, body, files) => {
        if (!body.details) return responseHandler.returnError(httpStatus.UNPROCESSABLE_ENTITY, "Tidak ada data yang bisa diproses")
        if (!employee) return responseHandler.returnError(httpStatus.UNPROCESSABLE_ENTITY, "Anda tidak terdaftar sebagai karyawan")
        if (!employee.division_id) return responseHandler.returnError(httpStatus.UNPROCESSABLE_ENTITY, "Anda tidak terdaftar pada divisi apapun")
        if (!files || files.length < 1) return responseHandler.returnError(httpStatus.UNPROCESSABLE_ENTITY, "Tidak ada gambar yang disertakan")

        body = body.details
        const currentTime = new Date()
        const trainings = await this.trainingDao.getClosestActive(currentTime)

        if (trainings.length < 1) return responseHandler.returnError(httpStatus.UNPROCESSABLE_ENTITY, "Tidak ada training yang sedang dijalankan")
        const payloads = trainings.map((training, i) => ({
            employee_id: employee.id,
            training_id: training.id,
            day_id: currentTime.getDay(),
            ...(files[i] && { img_path: files[i].path }),
            ...body[i]
        }))

        const trainingAttendanceData = await this.trainingAttendanceDao.bulkCreate(payloads)
        if (!trainingAttendanceData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Training Attendance Gagal dibuat");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Training Attendance Berhasil dibuat", trainingAttendanceData);
    }

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
