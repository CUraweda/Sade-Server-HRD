const httpStatus = require("http-status");
const TrainingAttendanceService = require("../service/TrainingAttendanceService");

class TrainingAttendanceController {
    constructor() {
        this.trainingAttendanceService = new TrainingAttendanceService();
    }
    
    getAll = async (req, res) => {
        try {
            const page = +req.query.page || 0;
            const limit = +req.query.limit || 10;
            const { search } = req.query;

            const offset = limit * page;
            const resData = await this.trainingAttendanceService.showPage(
                page,
                limit,
                offset,
                { search }
            );

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    getOne = async (req, res) => {
        try {
            const id = +req.params.id;
            if (!id) res.status(httpStatus["422_CLASS"]).send("Tolong sertakan ID");
            const resData = await this.trainingAttendanceService.showOne(id);

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };
    
    createByToken = async (req, res) => {
        try{
            console.log(req.user)
        }catch(e){
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }

    createOne = async (req, res) => {
        try {
            const resData = await this.trainingAttendanceService.create(req.body);

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    update = async (req, res) => {
        try {
            const id = +req.params.id;
            if (!id) res.status(httpStatus["422_CLASS"]).send("Tolong sertakan ID");
            const resData = await this.trainingAttendanceService.update(id, req.body);

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send({ error: e.message });
        }
    };

    delete = async (req, res) => {
        try {
            const id = +req.params.id;
            if (!id) res.status(httpStatus["422_CLASS"]).send("Tolong sertakan ID");
            const resData = await this.trainingAttendanceService.delete(id);

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };
}

module.exports = TrainingAttendanceController;
