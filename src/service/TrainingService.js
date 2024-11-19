const httpStatus = require("http-status");
const TrainingDao = require("../dao/TrainingDao");
const responseHandler = require("../helper/responseHandler");
const TrainingSuggestionDao = require("../dao/TrainingSuggestionDao");

class TrainingService {
    constructor() {
        this.trainingDao = new TrainingDao();
        this.trainingSuggestionDao = new TrainingSuggestionDao()
    }

    create = async (body) => {
        const trainingData = await this.trainingDao.create(body);
        if (!trainingData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to create training record");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Training record created successfully", trainingData);
    };

    update = async (id, body) => {
        const dataExist = await this.trainingDao.findById(id);
        if (!dataExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Training record not found");

        const trainingData = await this.trainingDao.updateWhere(body, { id });
        if (!trainingData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to update training record");

        return responseHandler.returnSuccess(httpStatus.OK, "Training record updated successfully", {});
    };

    delete = async (id) => {
        const trainingData = await this.trainingDao.deleteByWhere({ id });
        if (!trainingData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to delete training record");

        return responseHandler.returnSuccess(httpStatus.OK, "Training record deleted successfully", {});
    };

    showPage = async (page, limit, offset, filter) => {
        const totalRows = await this.trainingDao.getCount(filter);
        const totalPage = Math.ceil(totalRows / limit);

        const result = await this.trainingDao.getPage(offset, limit, filter);

        return responseHandler.returnSuccess(httpStatus.OK, "Training records retrieved successfully", {
            result,
            page,
            limit,
            totalRows,
            totalPage,
        });
    };

    showRecapDashboard = async () => {
        const trainingData = await this.trainingDao.getAllActive()
        const suggestionData = await this.trainingSuggestionDao.getAllUnapprove()

        return responseHandler.returnSuccess(httpStatus.OK, "Training record found", {
            training_counter: trainingData.length,
            suggestion_counter: suggestionData.length,
            data: [
                ...suggestionData,
                ...trainingData
            ]
        })
    }

    showOne = async (id) => {
        const trainingData = await this.trainingDao.getByIdWithEmployee(id)
        if (!trainingData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Training record not found");

        return responseHandler.returnSuccess(httpStatus.OK, "Training record found", trainingData);
    };
}

module.exports = TrainingService;
