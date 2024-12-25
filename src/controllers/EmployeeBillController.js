const httpStatus = require("http-status");
const EmployeeBillService = require("../service/EmployeeBillService");
const EmployeeAccountService = require("../service/EmployeeAccountService");

class EmployeeBillController {
  constructor() {
    this.employeeBillService = new EmployeeBillService();
    this.employeeAccountService = new EmployeeAccountService()
  }

  getAll = async (req, res) => {
    try {
      const page = +req.query.page || 0;
      const limit = +req.query.limit || 10;
      const { search, account_id, current_month } = req.query;

      const offset = limit * page;
      const resData = await this.employeeBillService.showPage(
        page,
        limit,
        offset,
        { search, account_id, current_month }
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
      const resData = await this.employeeBillService.showOne(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      console.log(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  createOne = async (req, res) => {
    try {
      const resData = await this.employeeBillService.create(req.body);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      console.log(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  }

  addOne = async (req, res) => {
    try {
      const resData = await this.employeeBillService.addOne({ employee_id: req.body.employee_id, account_id: req.body.account_id }, req.body);
      if (resData.response.status) {
        const { id, account_id } = resData.response.data
        console.log(resData.response.data)
        const updateAccount = await this.employeeAccountService.updateTotal(account_id, id)
        if (!updateAccount.response.status) return res.status(updateAccount.statusCode).send(updateAccount.response);
      }

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      console.log(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  }

  update = async (req, res) => {
    try {
      const id = +req.params.id;
      if (!id) res.status(httpStatus.UNPROCESSABLE_ENTITY).send("Please provide an ID");
      const resData = await this.employeeBillService.update(id, req.body);

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
      const resData = await this.employeeBillService.delete(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      console.log(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };
}

module.exports = EmployeeBillController;
