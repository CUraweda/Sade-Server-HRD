const httpStatus = require("http-status");
const EmployeeJobdeskService = require("../service/EmployeeJobdeskService");

class EmployeeJobdeskController {
    constructor() {
        this.employeeJobdeskService = new EmployeeJobdeskService();
    }

    getAll = async (req, res) => {
        try {
            const page = +req.query.page - 1 || 0;
            const limit = +req.query.limit || 10;
            const { search, employee_id } = req.query;


            const offset = limit * page;
            const resData = await this.employeeJobdeskService.showPage(
                page,
                limit,
                offset,
                { search, employee_id}
            );

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    getDifferenceDay = async (req, res) => {
        try {
            const id = +req.params.id
            const resData = await this.employeeJobdeskService.showDifferencesDay(id)
            
            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }

    getWeekRecap = async (req, res) => {
        try {
            const id = +req.params.id
            const resData = await this.employeeJobdeskService.showRecapWeekEID(id)
            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }

    getMonthRecap = async (req, res) => {
        try {
            const id = +req.params.id
            const resData = await this.employeeJobdeskService.showRecapMonhEID(id)
            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }

    getYearRecap = async (req, res) => {
        try {
            const id = +req.params.id
            const resData = await this.employeeJobdeskService.showRecapYearEID(id)
            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }

    getOne = async (req, res) => {
        try {
            const id = +req.params.id;
            if (!id) res.status(httpStatus.UNPROCESSABLE_ENTITY).send("Tolong sertakan ID");
            const resData = await this.employeeJobdeskService.showOne(id);

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    createOne = async (req, res) => {
        try {
            const resData = await this.employeeJobdeskService.create(req.body);

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    updateFinish = async (req, res) => {
        try{
            const id = +req.params.id;
            const { employee } = req.user
            if (!id) res.status(httpStatus.UNPROCESSABLE_ENTITY).send("Tolong sertakan ID");
            
            const resData = await this.employeeJobdeskService.updateFinish(id, employee);
        
            res.status(resData.statusCode).send(resData.response);
        }catch(e){
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }
    updateGrade = async (req, res) => {
        try {
            const id = +req.params.id;
            const { employee } = req.user
            if (!id) res.status(httpStatus.UNPROCESSABLE_ENTITY).send("Tolong sertakan ID");

            const resData = await this.employeeJobdeskService.updateGrade(id, employee, req.body.grade);

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }
    update = async (req, res) => {
        try {
            const id = +req.params.id;
            if (!id) res.status(httpStatus.UNPROCESSABLE_ENTITY).send("Tolong sertakan ID");
            const resData = await this.employeeJobdeskService.update(id, req.body);

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send({ error: e.message });
        }
    };

    delete = async (req, res) => {
        try {
            const id = +req.params.id;
            if (!id) res.status(httpStatus.UNPROCESSABLE_ENTITY).send("Tolong sertakan ID");
            const resData = await this.employeeJobdeskService.delete(id);

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send(e)
        }
    };
}

module.exports = EmployeeJobdeskController;
