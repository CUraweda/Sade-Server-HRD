const httpStatus = require("http-status");
const EmployeeAccountService = require("../service/EmployeeAccountService");

class EmployeeAccountController {
  constructor() {
    this.employeeAccountService = new EmployeeAccountService();
  }

  getAll = async (req, res) => {
    try {
      const page = +req.query.page || 0;
      const limit = +req.query.limit || 10;
      const { search, this_month } = req.query;

      const offset = limit * page;
      const resData = await this.employeeAccountService.showPage(
        page,
        limit,
        offset,
        { search, this_month }
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
      if (!id) res.status(httpStatus.UNPROCESSABLE_ENTITY).send("Please provide an ID");
      const resData = await this.employeeAccountService.showOne(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      console.log(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  createOne = async (req, res) => {
    try {
      const resData = await this.employeeAccountService.create(req.body);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      console.log(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  }

  createMonthly = async (req, res) => {
    try {
      const resData = await this.employeeAccountService.createMonthly(req.body);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      console.log(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  }

  updatePaid = async (req, res) => {
    try {
      const id = +req.params.id;
      if (!id) res.status(httpStatus.UNPROCESSABLE_ENTITY).send("Please provide an ID");
      const resData = await this.employeeAccountService.updatePaid(id);
  
      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      console.log(e);
      res.status(httpStatus.BAD_GATEWAY).send({ error: e.message });
    }
  }

  update = async (req, res) => {
    try {
      const id = +req.params.id;
      if (!id) res.status(httpStatus.UNPROCESSABLE_ENTITY).send("Please provide an ID");
      const resData = await this.employeeAccountService.update(id, req.body);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      console.log(e);
      res.status(httpStatus.BAD_GATEWAY).send({ error: e.message });
    }
  };

  delete = async (req, res) => {
    try {
      const id = +req.params.id;
      if (!id) res.status(httpStatus.UNPROCESSABLE_ENTITY).send("Please provide an ID");
      const resData = await this.employeeAccountService.delete(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      console.log(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };
}

module.exports = EmployeeAccountController;
