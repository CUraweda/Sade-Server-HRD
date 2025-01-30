const httpStatus = require("http-status");
const EmployeeService = require("../service/EmployeeService");
const { returnError } = require("../helper/responseHandler");

class EmployeeController {
  constructor() {
    this.employeeService = new EmployeeService();
  }

  create = async (req, res) => {
    try {
      const resData = await this.employeeService.createEmployee(req.body);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      console.log(e)
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  update = async (req, res) => {
    try {
      var id = req.params.id;

      const resData = await this.employeeService.updateEmployee(id, req.body);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      console.log(e)
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  finishProbation = async (req, res) => {
    try {
      var id = req.params.id;
      const employee = req.user?.employee

      const resData = await this.employeeService.actionProbation("FAIL", id, employee);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      console.log(e)
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  sendContract = async (req, res) => {
    try {
      var id = req.params.id;
      const employee = req.user?.employee

      const resData = await this.employeeService.actionProbation("SUCCESS", id, employee, req.body);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      console.log(e)
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  show = async (req, res) => {
    try {
      const id = req.params.id;

      const resData = await this.employeeService.showEmployee(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      console.log(e)
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  showRecapGrade = async (req, res) => {
    try {
      const resData = await this.employeeService.showRecapGrade();
      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      console.log(e)
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  showRecapStatus = async (req, res) => {
    try {
      const resData = await this.employeeService.showRecapStatus();
      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      console.log(e)
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  showRecapDivision = async (req, res) => {
    try {
      const resData = await this.employeeService.showRecapDivision();
      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      console.log(e)
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  showAllIsGuru = async (req, res) => {
    try {
    var isGuru = req.query.is_initial || "";

      const resData = await this.employeeService.showEmployeeIsGuru(isGuru);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      console.log(e)
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  showDetail = async (req, res) => {
    try {
      const id = +req.params.id
      const resData = await this.employeeService.showDetail(id)

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      console.log(e)
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  }

  showMe = async (req, res) => {
    try {
      const resData = await this.employeeService.showByUser(req.user)

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      console.log(e)
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  }

  showAll = async (req, res) => {
    try {
      const page = req.query.page ? req.query.page != "0" ? +req.query.page - 1 : 0 : 0
      const limit = +req.query.limit || 10;
      const { search, division_id, status, isAssign, have_account, sort_name, probation_end_date, probation_start_date } = req.query
      const offset = limit * page;

      const resData = await this.employeeService.showPage(
        page,
        limit,
        { search, isAssign, division_id, status, have_account, sort_name, probation_end_date, probation_start_date },
        offset
      );

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      console.log(e)
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };
  
  showAttachment = async (req, res) => {
    try {
      const { employee } = req.user
      const resData = await this.employeeService.showAttachmentByUser(employee?.id)
      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      console.log(e)
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  }

  delete = async (req, res) => {
    try {
      var id = req.params.id;

      const resData = await this.employeeService.deleteEmployee(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      console.log(e)
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  importExcel = async (req, res) => {
    try {
      const resData = await this.employeeService.importFromExcel(req);

      res.status(resData.statusCode).send(resData.response);
      // res.status(httpStatus.OK).send(data);
    } catch (e) {
      console.log(e)
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

}

module.exports = EmployeeController;
