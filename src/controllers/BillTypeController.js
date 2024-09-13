const httpStatus = require("http-status");
const BillTypeService = require("../service/BillTypeService");

class BillTypeController {
  constructor() {
    this.billTypeService = new BillTypeService();
  }

  getAll = async (req, res) => {
    try {
      const page = +req.query.page - 1 || 0;
      const limit = +req.query.limit || 10;
      const { search } = req.query;

      const offset = limit * page;
      const resData = await this.billTypeService.showPage(
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
      if (!id) res.status(httpStatus.UNPROCESSABLE_ENTITY).send("Please provide an ID");
      const resData = await this.billTypeService.showOne(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      console.log(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  createOne = async (req, res) => {
    try {
      const resData = await this.billTypeService.create(req.body);

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
      const resData = await this.billTypeService.update(id, req.body);

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
      const resData = await this.billTypeService.delete(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      console.log(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };
}

module.exports = BillTypeController;
