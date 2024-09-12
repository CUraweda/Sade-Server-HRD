const locationDao = require("../dao/locationDao");

const httpStatus = require("http-status");
const LocationDao = require("../dao/locationDao");
const responseHandler = require("../helper/responseHandler");

class LocationService {
    constructor() {
        this.locationDao = new LocationDao();
    }

    create = async (body) => {
        const locationData = await this.locationDao.create(body);
        if (!locationData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Form Position Gagal dibuat");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Form Position Berhasil dibuat", locationData);
    };

    update = async (id, body) => {
        const dataExist = await this.locationDao.findById(id);
        if (!dataExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Form Position Tidak Ada");

        const locationData = await this.locationDao.updateWhere(body, { id });
        if (!locationData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Form Position Gagal diperbaharui");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Form Position Berhasil diperbaharui", {});
    };

    delete = async (id) => {
        const locationData = await this.locationDao.deleteByWhere({ id });
        if (!locationData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Form Position Gagal dihapus");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Form Position Berhasil dihapus", {});
    };

    showPage = async (page, limit, offset, filter) => {
        const totalRows = await this.locationDao.getCount(filter);
        const totalPage = Math.ceil(totalRows / limit);

        const result = await this.locationDao.getPage(offset, limit, filter);

        return responseHandler.returnSuccess(httpStatus.OK, "Data Form Position Berhasil diambil",
            {
                result, page, limit,
                totalRows: totalRows,
                totalPage: totalPage,
            }
        );
    };

    showOne = async (id) => {
        const locationData = await this.locationDao.findById(id);
        if (!locationData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Form Position Tidak ditemukan");

        return responseHandler.returnSuccess(httpStatus.OK, "Data Form Position Ditemukan", locationData);
    };
}

module.exports = LocationService;