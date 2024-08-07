const httpStatus = require("http-status");
const BillTypeDao = require("../dao/BillTypeDao");
const responseHandler = require("../helper/responseHandler");

class BillTypeService {
    constructor() {
        this.billTypeDao = new BillTypeDao();
    }

    create = async (body) => {
        const billTypeData = await this.billTypeDao.create(body);
        if (!billTypeData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Bill Type data could not be created");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Bill Type data successfully created", billTypeData);
    };

    update = async (id, body) => {
        const dataExist = await this.billTypeDao.findById(id);
        if (!dataExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Bill Type data not found");

        const billTypeData = await this.billTypeDao.updateWhere(body, { id });
        if (!billTypeData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Bill Type data could not be updated");

        return responseHandler.returnSuccess(httpStatus.OK, "Bill Type data successfully updated", {});
    }

    delete = async (id) => {
        const billTypeData = await this.billTypeDao.deleteByWhere({ id });
        if (!billTypeData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Bill Type data could not be deleted");

        return responseHandler.returnSuccess(httpStatus.OK, "Bill Type data successfully deleted", {});
    }

    showPage = async (page, limit, offset, filter) => {
        const totalRows = await this.billTypeDao.getCount(filter);
        const totalPage = Math.ceil(totalRows / limit);

        const result = await this.billTypeDao.getPage(offset, limit, filter);

        return responseHandler.returnSuccess(httpStatus.OK, "Bill Type data successfully retrieved", {
            result, page, limit,
            totalRows: totalRows,
            totalPage: totalPage,
        });
    }

    showOne = async (id) => {
        const billTypeData = await this.billTypeDao.findById(id);
        if (!billTypeData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Bill Type data not found");

        return responseHandler.returnSuccess(httpStatus.OK, "Bill Type data found", billTypeData);
    }
}

module.exports = BillTypeService;
