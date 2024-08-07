const httpStatus = require("http-status");
const DivisionDao = require("../dao/DivisionDao");
const responseHandler = require("../helper/responseHandler");

class DivisionService {
    constructor() {
        this.divisionDao = new DivisionDao();
    }

    create = async (body) => {
        const divisionData = await this.divisionDao.create(body)
        if (!divisionData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Division Gagal dibuat");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Division Berhasil dibuat", divisionData);
    };

    update = async (id, body) => {
        const dataExist = await this.divisionDao.findById(id)
        if (dataExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Division Tidak Ada");

        const divisionData = await this.divisionDao.updateWhere(body, { id })
        if (!divisionData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Division Gagal diperbaharui");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Division Berhasil diperbaharui", {});
    }

    delete = async (id) => {
        const divisionData = await this.divisionDao.deleteByWhere({ id })
        if (!divisionData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Division Gagal dihapus");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Division Berhasil dihapus", {});
    }

    showPage = async (page, limit, offset, filter) => {
        const totalRows = await this.divisionDao.getCount(filter);
        const totalPage = Math.ceil(totalRows / limit);

        const result = await this.divisionDao.getPage(offset, limit, filter);

        return responseHandler.returnSuccess(httpStatus.OK, "Data Division Berhasil diambil",
            {
                result, page, limit,
                totalRows: totalRows,
                totalPage: totalPage,
            }
        );
    }

    showOne = async (id) => {
        const divisionData = await this.divisionDao.findById(id);
        if (!divisionData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Division Tidak ditemukan");

        return responseHandler.returnSuccess(httpStatus.OK, "Data Division Ditemukan", divisionData);

    }
}

module.exports = DivisionService;
