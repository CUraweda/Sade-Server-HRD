const httpStatus = require("http-status");
const EmployeeAttachmentService = require("../service/EmployeeAttachmentService");

class EmployeeAttachmentController {
    constructor() {
        this.employeeAttachmentService = new EmployeeAttachmentService();
    }

    getAll = async (req, res) => {
        try {
            const page = +req.query.page || 0;
            const limit = +req.query.limit || 10;
            const { search } = req.query;

            const offset = limit * page;
            const resData = await this.employeeAttachmentService.showPage(
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

    getByEmployee = async (req, res) => {
        try{
            const id = +req.params.id
            const resData = await this.employeeAttachmentService.showByEmployee(id)

            res.status(resData.statusCode).send(resData.response);
        }catch(e){
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);        
        }
    }

    getOne = async (req, res) => {
        try {
            const id = +req.params.id;
            if (!id) res.status(httpStatus["422_CLASS"]).send("Tolong sertakan ID");
            const resData = await this.employeeAttachmentService.showOne(id);

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    createOne = async (req, res) => {
        try {
            if(req.file){
                req.body.file_path = req.file.path,
                req.body.file_name = req.file.filename,
                req.body.file_type = req.file.mimetype
            }
            const resData = await this.employeeAttachmentService.create(req.body);
            
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
            if(req.file){
                req.body.file_path = req.file.path,
                req.body.file_name = req.file.filename,
                req.body.file_type = req.file.mimetype
            }
            const resData = await this.employeeAttachmentService.update(id, req.body);

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
            const resData = await this.employeeAttachmentService.delete(id);

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };
}

module.exports = EmployeeAttachmentController;
