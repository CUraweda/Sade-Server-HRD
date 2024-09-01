const httpStatus = require("http-status");
const DivisionService = require("../service/DivisionService");

class DivisionController {
  constructor() {
    this.divisionService = new DivisionService();
  }
  getAll = async (req, res) => {
    try {
      const page = +req.query.page || 0
      const limit = +req.query.limit || 10;
      const { search } = req.query

      const offset = limit * page;
      const resData = await this.divisionService.showPage(
        page,
        limit,
        offset,
        { search }
      );

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      console.log(e)
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  getOne = async (req, res) => {
    try {
      const id = +req.params.id;
      if (!id) res.status(httpStatus.UNPROCESSABLE_ENTITY).send("Tolong sertakan ID")
      const resData = await this.divisionService.showOne(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      console.log(e)
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  createOne = async (req, res) => {
    try {
      const resData = await this.divisionService.create(req.body)

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      console.log(e)
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  }

  update = async (req, res) => {
    try {
      const id = +req.params.id;
      if (!id) res.status(httpStatus.UNPROCESSABLE_ENTITY).send("Tolong sertakan ID")
      const resData = await this.divisionService.update(id, req.body);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      console.log(e)
      res.status(httpStatus.BAD_GATEWAY).send({ error: e.message });
    }
  };

  delete = async (req, res) => {
    try {
      const id = +req.params.id;
      if (!id) res.status(httpStatus.UNPROCESSABLE_ENTITY).send("Tolong sertakan ID")
      const resData = await this.divisionService.delete(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      console.log(e)
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };
}

module.exports = DivisionController