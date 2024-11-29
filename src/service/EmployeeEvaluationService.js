const httpStatus = require("http-status");
const EmployeeEvaluationDao = require("../dao/EmployeeEvaluationDao");
const EmployeeDao = require("../dao/EmployeeDao");
const AcademicYearDao = require('../dao/AcademicYearDao')
const responseHandler = require("../helper/responseHandler");

class EmployeeEvaluationService {
    constructor() {
        this.employeeDao = new EmployeeDao()
        this.academicYearDao = new AcademicYearDao()
        this.employeeEvaluationDao = new EmployeeEvaluationDao();
    }

    generateUID = (employee_id, academic_year, month_id) => {
        return `${employee_id}|${academic_year}|${month_id}`
    }

    create = async (body) => {
        const employeeEvaluationData = await this.employeeEvaluationDao.create(body);
        if (!employeeEvaluationData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to create employee evaluation");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Employee evaluation created successfully", employeeEvaluationData);
    };

    createMany = async (body = []) => {
        const employeeEvaluationData = await this.employeeEvaluationDao.bulkCreate(body);
        if (!employeeEvaluationData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to create employee evaluations");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Employee evaluations created successfully", employeeEvaluationData);
    };

    createMonthly = async (data) => {
        let { month_id, division_id } = data
        if (!month_id) month_id = new Date().getMonth()
        const employeeData = await this.employeeDao.getEmployeeForEvaluation(data, month_id)
        if (employeeData.length < 1) return responseHandler.returnError(httpStatus.BAD_REQUEST, "No data need to be generated");

        let currentAcademicYear = await this.academicYearDao.getHighestAcademicYear()
        if (!currentAcademicYear) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to fetch current academic year employee evaluations");
        currentAcademicYear = currentAcademicYear.name

        const createdEvaluation = []
        for (let employee of employeeData) {
            if (employee.employeeevaluations.length > 0) continue
            createdEvaluation.push({
                employee_id: employee.id,
                month_start: month_id,
                division_id,
                academic_year: currentAcademicYear,
                uid: this.generateUID(employee.id, currentAcademicYear, month_id),
            })
        }
        if (createdEvaluation.length < 1) return responseHandler.returnError(httpStatus.BAD_REQUEST, "No data need to be generated");

        const employeeEvaluationDatas = await this.employeeEvaluationDao.bulkCreate(createdEvaluation)
        if (!employeeEvaluationDatas) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to generate employee evaluations");
        await Promise.all(
            employeeEvaluationDatas.map((evaluation) =>
              this.employeeDao.updateById({ current_evaluation_id: evaluation.id }, evaluation.employee_id)
            )
          );          
        return responseHandler.returnSuccess(httpStatus.OK, "Employee evaluation generated successfully", employeeEvaluationDatas);
    }

    update = async (id, body) => {
        const dataExist = await this.employeeEvaluationDao.findById(id);
        if (!dataExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Employee evaluation not found");

        const employeeEvaluationData = await this.employeeEvaluationDao.updateWhere(body, { id });
        if (!employeeEvaluationData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to update employee evaluation");

        return responseHandler.returnSuccess(httpStatus.OK, "Employee evaluation updated successfully", {});
    };

    delete = async (id) => {
        const employeeEvaluationData = await this.employeeEvaluationDao.deleteByWhere({ id });
        if (!employeeEvaluationData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to delete employee evaluation");

        return responseHandler.returnSuccess(httpStatus.OK, "Employee evaluation deleted successfully", {});
    };

    showPage = async (page, limit, offset, filter) => {
        const totalRows = await this.employeeEvaluationDao.getCount(filter);
        const totalPage = Math.ceil(totalRows / limit);

        const result = await this.employeeEvaluationDao.getPage(offset, limit, filter);

        return responseHandler.returnSuccess(httpStatus.OK, "Employee evaluations retrieved successfully", {
            result,
            page,
            limit,
            totalRows,
            totalPage,
        });
    };

    showOne = async (id) => {
        const employeeEvaluationData = await this.employeeEvaluationDao.findById(id);
        if (!employeeEvaluationData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Employee evaluation not found");

        return responseHandler.returnSuccess(httpStatus.OK, "Employee evaluation found", employeeEvaluationData);
    };
    
    showDetail = async (id) => {
        const employeeEvaluationData = await this.employeeEvaluationDao.getDetail(id);
        if (!employeeEvaluationData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Employee evaluation not found");

        return responseHandler.returnSuccess(httpStatus.OK, "Employee evaluation found", employeeEvaluationData);
    };
}

module.exports = EmployeeEvaluationService;
