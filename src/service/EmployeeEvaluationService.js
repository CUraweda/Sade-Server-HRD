const httpStatus = require("http-status");
const EmployeeEvaluationDao = require("../dao/EmployeeEvaluationDao");
const EmployeeDao = require("../dao/EmployeeDao");
const AcademicYearDao = require('../dao/AcademicYearDao')
const responseHandler = require("../helper/responseHandler");
// const xlsx = require('xlsx');

// // Data for the Excel file
// const data = [
//     ["ID", "Name", "Age", "City"],    // Row 1
//     [null, null, null, null],         // Row 2 (will be merged with Row 1)
//     [1, "John Doe", 28, "New York"],  // Data row 3
//     [2, "Jane Smith", 34, "Los Angeles"],
//     [3, "Sam Brown", 22, "Chicago"]
// ];

// // Create a new workbook
// const workbook = xlsx.utils.book_new();

// // Convert the data to a worksheet
// const worksheet = xlsx.utils.aoa_to_sheet(data);

// // Define merge ranges
// worksheet['!merges'] = [
//     { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } }, // Merge Column A (ID) for Rows 1-2
//     { s: { r: 0, c: 1 }, e: { r: 1, c: 1 } }, // Merge Column B (Name) for Rows 1-2
//     { s: { r: 0, c: 2 }, e: { r: 1, c: 2 } }, // Merge Column C (Age) for Rows 1-2
//     { s: { r: 0, c: 3 }, e: { r: 1, c: 3 } }  // Merge Column D (City) for Rows 1-2
// ];

// // Append the worksheet to the workbook
// xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");

// // Write the workbook to a file
// const filePath = "./merged_rows.xlsx";
// xlsx.writeFile(workbook, filePath);

// console.log(`Excel file with merged rows created at: ${filePath}`);


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

    calculateOne = async (data) => {
        const { id } = data
        const calculationEvaluationDatas = await this.employeeEvaluationDao.getDetailCalculation(id);
        if (!calculationEvaluationDatas) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to create employee evaluations");


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
