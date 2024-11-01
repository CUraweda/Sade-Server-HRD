const httpStatus = require("http-status");
const FormPositionDao = require("../dao/FormPositionDao");
const responseHandler = require("../helper/responseHandler");

class FormPositionService {
    constructor() {
        this.formPositionDao = new FormPositionDao();
    }

    create = async (body) => {
        const formPositionData = await this.formPositionDao.create(body);
        if (!formPositionData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Form Position Gagal dibuat");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Form Position Berhasil dibuat", formPositionData);
    };

    update = async (id, body) => {
        const dataExist = await this.formPositionDao.findById(id);
        if (!dataExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Form Position Tidak Ada");

        const formPositionData = await this.formPositionDao.updateWhere(body, { id });
        if (!formPositionData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Form Position Gagal diperbaharui");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Form Position Berhasil diperbaharui", {});
    };

    delete = async (id) => {
        const formPositionData = await this.formPositionDao.deleteByWhere({ id });
        if (!formPositionData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Form Position Gagal dihapus");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Form Position Berhasil dihapus", {});
    };

    showPage = async (page, limit, offset, filter) => {
        const totalRows = await this.formPositionDao.getCount(filter);
        const totalPage = Math.ceil(totalRows / limit);

        const result = await this.formPositionDao.getPage(offset, limit, filter);

        return responseHandler.returnSuccess(httpStatus.OK, "Data Form Position Berhasil diambil",
            {
                result, page, limit,
                totalRows: totalRows,
                totalPage: totalPage,
            }
        );
    };

    showOne = async (id) => {
        const formPositionData = await this.formPositionDao.findById(id);
        if (!formPositionData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Form Position Tidak ditemukan");

        return responseHandler.returnSuccess(httpStatus.OK, "Data Form Position Ditemukan", formPositionData);
    };
}

module.exports = FormPositionService;
