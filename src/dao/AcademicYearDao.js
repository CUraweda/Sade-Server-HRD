const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const AcademicYear = models.academicyear;

class AcademicYearDao extends SuperDao {
  constructor() {
    super(AcademicYear);
  }
  async getHighestAcademicYear(){
    return AcademicYear.findOne({
        order: [["start", "DESC"]]
    })
  }
}
module.exports = AcademicYearDao;
