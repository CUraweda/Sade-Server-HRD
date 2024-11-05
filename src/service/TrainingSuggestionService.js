const httpStatus = require("http-status");
const TrainingSuggestionDao = require("../dao/TrainingSuggestionDao");
const responseHandler = require("../helper/responseHandler");
const TrainingDao = require("../dao/TrainingDao");
const constantData = require("../config/constant")

class TrainingSuggestionService {
    constructor() {
        this.trainingSuggestionDao = new TrainingSuggestionDao();
        this.trainingDao = new TrainingDao()
    }

    create = async (body) => {
        const trainingSuggestionData = await this.trainingSuggestionDao.create(body);
        if (!trainingSuggestionData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Training Suggestion Gagal dibuat");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Training Suggestion Berhasil dibuat", trainingSuggestionData);
    };

    createByUser = async (user, body) => {
        if (!user.employee) return responseHandler.returnError(httpStatus.UNPROCESSABLE_ENTITY, "Anda bukan termasuk karyawan");
        body.employee_id = user.employee.id

        const trainingSuggestionData = await this.trainingSuggestionDao.create(body);
        if (!trainingSuggestionData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Training Suggestion Gagal dibuat");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Training Suggestion Berhasil dibuat", trainingSuggestionData);
    }

    approveOne = async (id, body) => {
        const { employee } = body
        delete body.employee
        if (!employee) return responseHandler.returnError(httpStatus.UNPROCESSABLE_ENTITY, "Anda bukan termasuk karyawan");
        const dataExist = await this.trainingSuggestionDao.findById(id);
        if (!dataExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Training Suggestion Tidak Ada");

        const trainingSuggestionData = await this.trainingSuggestionDao.updateWhere(body, { id });
        if (!trainingSuggestionData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Training Suggestion Gagal diperbaharui");

        if(body.is_approved){
            const { approver_id, employee_id, title, start_date, end_date, location} = dataExist
            const trainingData = await this.trainingDao.create({ proposer_id: approver_id, purpose: body.purpose, status: "Menunggu", is_active: true, employee_id, title, start_date, end_date, location})
            if (!trainingData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Training Gagal dibuat");
        }

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Training Suggestion Berhasil diperbaharui", {});
    }

    update = async (id, body) => {
        const dataExist = await this.trainingSuggestionDao.findById(id);
        if (!dataExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Training Suggestion Tidak Ada");

        const trainingSuggestionData = await this.trainingSuggestionDao.updateWhere(body, { id });
        if (!trainingSuggestionData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Training Suggestion Gagal diperbaharui");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Training Suggestion Berhasil diperbaharui", {});
    };

    delete = async (id) => {
        const trainingSuggestionData = await this.trainingSuggestionDao.deleteByWhere({ id });
        if (!trainingSuggestionData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Training Suggestion Gagal dihapus");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Training Suggestion Berhasil dihapus", {});
    };

    showPage = async (page, limit, offset, filter) => {
        const totalRows = await this.trainingSuggestionDao.getCount(filter);
        const totalPage = Math.ceil(totalRows / limit);

        const result = await this.trainingSuggestionDao.getPage(offset, limit, filter);

        return responseHandler.returnSuccess(httpStatus.OK, "Data Training Suggestion Berhasil diambil",
            {
                result, page, limit,
                totalRows: totalRows,
                totalPage: totalPage,
            }
        );
    };

    showOne = async (id) => {
        const trainingSuggestionData = await this.trainingSuggestionDao.findById(id);
        if (!trainingSuggestionData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Training Suggestion Tidak ditemukan");

        return responseHandler.returnSuccess(httpStatus.OK, "Data Training Suggestion Ditemukan", trainingSuggestionData);
    };
}

module.exports = TrainingSuggestionService;
