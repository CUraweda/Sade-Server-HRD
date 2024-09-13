const httpStatus = require("http-status");
const EmployeeAsessorService = require("../service/EmployeeAsessorService");

class EmployeeAsessorController {
    constructor() {
        this.employeeAsessorService = new EmployeeAsessorService();
    }

    getAll = async (req, res) => {
        try {
            const page = +req.query.page - 1 || 0;
            const limit = +req.query.limit || 10;
            let { search, only_asessor } = req.query;

            if(!only_asessor) only_asessor = "1"
            const offset = limit * page;
            const resData = await this.employeeAsessorService.showPage(
                page,
                limit,
                offset,
                { search, only_asessor }
            );

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    updateActivate = async (req, res) => {
        try {
            const id = +req.params.id;
            if (!id) res.status(httpStatus.UNPROCESSABLE_ENTITY).send("Tolong sertakan ID");
            const resData = await this.employeeAsessorService.update(id, { is_asessor: true });
            
            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send({ error: e.message });
        }
    };
    
    updateDeactivate = async (req, res) => {
        try {
            const id = +req.params.id;
            if (!id) res.status(httpStatus.UNPROCESSABLE_ENTITY).send("Tolong sertakan ID");
            const resData = await this.employeeAsessorService.update(id, { is_asessor: false });

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send({ error: e.message });
        }
    };
}

module.exports = EmployeeAsessorController;
