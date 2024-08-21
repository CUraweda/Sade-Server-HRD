const httpStatus = require("http-status");
const EmployeeVacationService = require("../service/EmployeeVacationService");
const path = require("path");
const fs = require("fs");

class EmployeeVacationController {
    constructor() {
        this.employeeVacationService = new EmployeeVacationService();
    }

    getAll = async (req, res) => {
        try {
            const page = +req.query.page || 0;
            const limit = +req.query.limit || 10;
            const { search, type, status, date, division_id, employee_id } = req.query;

            const offset = limit * page;
            const resData = await this.employeeVacationService.showPage(
                page,
                limit,
                offset,
                { search, type, status, date, division_id, employee_id }
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
            const resData = await this.employeeVacationService.showOne(id);

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    createOne = async (req, res) => {
        try {
            if (req.file) req.body.file_path = req.file.path
            const resData = await this.employeeVacationService.create(req.body);

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    createRequest = async (req, res) => {
        try {
            const { employee } = req.user
            if (req.file) req.body.file_path = req.file.path
            const resData = await this.employeeVacationService.createRequestOne(employee, req.body)

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }

    changeStatus = async (req, res) => {
        try {
            const id = +req.params.id;
            const condition = req.params.condition
            const resData = await this.employeeVacationService.changeStatus(id, condition, req.user);
    
            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send({ error: e.message });
        }
    }

    changeData = async (req, res) => {
        try {
            const id = +req.params.id;
            if (req.file) req.body.file_path = req.file.path
            const resData = await this.employeeVacationService.change(id, req.body);

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send({ error: e.message });
        }
    }
    update = async (req, res) => {
        try {
            const id = +req.params.id;
            if (req.file) req.body.file_path = req.file.path
            if (!id) res.status(httpStatus["422_CLASS"]).send("Tolong sertakan ID");
            const resData = await this.employeeVacationService.update(id, req.body);

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send({ error: e.message });
        }
    };
    
    removeData = async (req, res) => {
        try{
            const id = +req.params.id;
            if (!id) res.status(httpStatus["422_CLASS"]).send("Tolong sertakan ID");
            const resData = await this.employeeVacationService.removeData(id);
        
            res.status(resData.statusCode).send(resData.response);
        }catch(e){
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send({ error: e.message });
        }
    }

    delete = async (req, res) => {
        try {
            const id = +req.params.id;
            if (!id) res.status(httpStatus["422_CLASS"]).send("Tolong sertakan ID");
            const resData = await this.employeeVacationService.delete(id);

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    downloadFile = async (req, res) => {
        try {
          const filePath = req.query.file_path;
    
          if (!filePath) {
            return res.status(httpStatus.BAD_REQUEST).send({
              status: false,
              code: httpStatus.BAD_REQUEST,
              message: "File path not provided.",
            });
          }
    
          if (fs.existsSync(filePath)) {
            const filename = path.basename(filePath);
            res.setHeader("Content-Type", "application/octet-stream");
            res.setHeader(
              "Content-Disposition",
              `attachment; filename="${filename}"`
            );
    
            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);
          } else {
            res.status(httpStatus.NOT_FOUND).send({
              status: false,
              code: httpStatus.NOT_FOUND,
              message: "File not found.",
            });
          }
        } catch (e) {
          console.error(e);
          res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
            status: false,
            code: httpStatus.INTERNAL_SERVER_ERROR,
            message: e.message,
          });
        }
      };
}

module.exports = EmployeeVacationController;
