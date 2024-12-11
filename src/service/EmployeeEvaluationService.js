const httpStatus = require("http-status");
const EmployeeEvaluationDao = require("../dao/EmployeeEvaluationDao");
const EmployeeDao = require("../dao/EmployeeDao");
const AcademicYearDao = require('../dao/AcademicYearDao')
const EmployeeJobdeskDao = require('../dao/EmployeeJobdeskDao')
const responseHandler = require("../helper/responseHandler");
const ExcelJS = require('exceljs');
const fs = require('fs')
const EmailHelper = require('../helper/EmailHelper');
const EmployeeEvaluationItemDao = require("../dao/EmployeeEvaluationItemDao");
const emailHelper = new EmailHelper()
class EmployeeEvaluationService {
    constructor() {
        this.employeeDao = new EmployeeDao()
        this.academicYearDao = new AcademicYearDao()
        this.employeeJobdeskDao = new EmployeeJobdeskDao()
        this.employeeEvaluationDao = new EmployeeEvaluationDao();
        this.employeeEvaluationItemDao = new EmployeeEvaluationItemDao()
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

    chooseGradeForJobdesk = (jobdesk, listGrade = []) => {
        if (listGrade.length < 1) return false
        const { personal_grade, partner_grade, assesor_grade } = jobdesk

        const grades = [personal_grade, partner_grade, assesor_grade].filter(grade => grade !== null);
        const averageGrade = grades.reduce((sum, grade) => sum + grade, 0) / grades.length
        let choosenGrade = listGrade[listGrade.length - 1]
        if (averageGrade > 0) for (let grade of listGrade) if (averageGrade >= grade.indicator) { choosenGrade = grade; break }

        return { overall_grade_raw: averageGrade, overall_grade: choosenGrade.grade, choosen_grade_id: choosenGrade.id }
    }

    calculateOne = async (id) => {
        const evaluationData = await this.employeeEvaluationDao.getDetail(id)
        if (!evaluationData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to get detail data");

        const calculationEvaluationDatas = await this.employeeEvaluationDao.getDetailCalculation(id);
        if (!calculationEvaluationDatas) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to get calculation data");
        
        let checkerData = []
        for (let unitIndex in calculationEvaluationDatas) {
            const jobdeskUnit = calculationEvaluationDatas[unitIndex]
            if (jobdeskUnit.employeejobdesks.length < 1) continue
            for (let jobdeskIndex in jobdeskUnit.employeejobdesks) {
                const employeeJobdesk = jobdeskUnit.employeejobdesks[jobdeskIndex]
                if (employeeJobdesk.choosen_grade_id) continue
                if (!employeeJobdesk.jobdeskgroupgrading.jobdeskgradings.length < 1) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to get calculation data");
                const gradingData = this.chooseGradeForJobdesk(employeeJobdesk, employeeJobdesk.jobdeskgroupgrading.jobdeskgradings)
                await this.employeeJobdeskDao.updateById(gradingData, employeeJobdesk.id)
                checkerData.push(gradingData)
                calculationEvaluationDatas[unitIndex].employeejobdesks[jobdeskIndex] = { ...employeeJobdesk, ...gradingData }
            }
        }
        return responseHandler.returnError(httpStatus.BAD_REQUEST, {
            checkerData
        });
        this.employeeDao.updateById({ current_evaluation_id: null }, evaluationData.employee_id)
        this.employeeEvaluationDao.updateById({ month_end: new Date().getMonth() + 1 }, id)
        const excelPath = await this.createExcelEvaluation(evaluationData, calculationEvaluationDatas)
        if (!excelPath) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to create excel data");
        await this.employeeEvaluationDao.updateById({ file_path: excelPath }, evaluationData.id)

        const employeeData = evaluationData.employee
        if (employeeData.email) {
            setImmediate(async () => {
                await emailHelper.sendExcelEvaluation(employeeData.email, { employee: employeeData, path: excelPath })
            })
        }

        return responseHandler.returnSuccess(httpStatus.CREATED, "Employee evaluations created successfully", calculationEvaluationDatas);
    };

    createExcelEvaluation = async (evalData, data) => {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Evaluasi');

        const employeeData = evalData.employee
        sheet.addRow(["NAMA", employeeData.full_name.toUpperCase(), employeeData.name, employeeData.name, "PLANNING MANAGEMENT"])
        sheet.mergeCells(1, 2, 1, 4)
        sheet.addRow([`PENILAIAN ${evalData.division.name.toUpperCase()}`, null, null, null, "SIGN KEPALA SEKOLAH: "])
        sheet.mergeCells(2, 1, 2, 4)
        const changeHeight2 = sheet.getRow(2)
        changeHeight2.height = 30
        const imageId = workbook.addImage({
            filename: 'Sade Logo.png',
            extension: 'png',
        });

        sheet.addImage(imageId, {
            tl: { col: 5, row: 1.3 },
            ext: { height: 50, width: 60 }
        });


        const row2Cells = [sheet.getCell(2, 1), sheet.getCell(2, 2), sheet.getCell(2, 3), sheet.getCell(2, 4)];
        row2Cells.forEach(cell => {
            cell.font = {
                name: 'Arial',
                size: 14,
                bold: true
            };
        });

        const currentDate = new Intl.DateTimeFormat('id-ID', {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            timeZone: 'Asia/Jakarta',
        }).format(new Date())

        sheet.addRow(["TAHUN AJARAN", null, evalData.academic_year, null, `tanggal: ${currentDate}`, null, null, "PERSONAL", "PARTNER", "SUPERVISOR", "TOTAL"])
        sheet.mergeCells(3, 1, 3, 2)
        sheet.mergeCells(3, 3, 3, 4)
        sheet.addRow([])

        const headerRow = sheet.addRow(["ITEMS", "JOBDESK", null, null, "PENILAIAN", "NILAI", "POINT", "PERSONAL", "PARTNER", "SUPERVISOR", "TOTAL"]);
        headerRow.eachCell(cell => {
            cell.alignment = { vertical: 'middle', horizontal: 'left' };
        });
        sheet.mergeCells(5, 2, 5, 4)
        sheet.mergeCells(3, 8, 5, 8)
        sheet.mergeCells(3, 9, 5, 9)
        sheet.mergeCells(3, 10, 5, 10)
        sheet.mergeCells(3, 11, 5, 11)
        for (let i = 8; i <= 11; i++) {
            const cell = sheet.getCell(3, i);
            cell.alignment = { textRotation: 90, vertical: 'middle', horizontal: 'center' };
        }

        const smallSizes = [sheet.getCell(3, 8), sheet.getCell(3, 9), sheet.getCell(3, 10), sheet.getCell(3, 11)]
        smallSizes.forEach(cell => {
            cell.font = {
                name: "Arial",
                size: 5
            }
        })

        let row = 6;
        data.forEach(unit => {
            const unitStart = row;
            unit.employeejobdesks.forEach(jobdesk => {
                const jobdeskStart = row;
                jobdesk.jobdeskgroupgrading.jobdeskgradings.forEach(grade => {
                    sheet.addRow([unit.name, jobdesk.name, null, null, grade.name, grade.grade, grade.indicator, jobdesk.personal_grade || 0, jobdesk.partner_grade || 0, jobdesk.assesor_grade || 0, jobdesk.overall_grade]);
                    row++;
                });
                sheet.mergeCells(jobdeskStart, 2, row - 1, 4)
                sheet.mergeCells(jobdeskStart, 8, row - 1, 8)
                sheet.mergeCells(jobdeskStart, 9, row - 1, 9)
                sheet.mergeCells(jobdeskStart, 10, row - 1, 10)
                sheet.mergeCells(jobdeskStart, 11, row - 1, 11)

                const jobdeskCell = sheet.getCell(jobdeskStart, 2)
                jobdeskCell.alignment = { vertical: 'middle', horizontal: "left" }

                for (let col of [8, 9, 10, 11]) {
                    const cell = sheet.getCell(jobdeskStart, col);
                    cell.alignment = { vertical: 'middle', horizontal: 'center' };
                }
            });
            sheet.mergeCells(unitStart, 1, row - 1, 1);
        });

        sheet.getColumn(1).width = 7
        sheet.getColumn(2).alignment = { wrapText: true, vertical: "middle" }
        sheet.getColumn(6).width = 6
        sheet.getColumn(7).width = 6
        sheet.getColumn(8).width = 5
        sheet.getColumn(9).width = 5
        sheet.getColumn(10).width = 5
        sheet.getColumn(11).width = 5

        for (let i = 6; i < row; i++) {
            const cell = sheet.getCell(i, 1);
            cell.alignment = { textRotation: 90, vertical: 'middle', horizontal: 'center' };
        }

        sheet.columns.forEach((column, index) => {
            let maxLength = 10;
            const maxAllowedWidth = 30;
            if (![0, 5, 6, 7, 8, 9, 10].includes(index)) {
                column.eachCell({ includeEmpty: true }, cell => {
                    const cellValue = cell.value ? cell.value.toString() : "";
                    maxLength = Math.max(maxLength, cellValue.length);
                });
                column.width = Math.min(maxLength + 2, maxAllowedWidth);
            }
        });

        const startRow = headerRow.number;
        const endRow = row - 1;
        for (let r = startRow; r <= endRow; r++) {
            const currentRow = sheet.getRow(r);
            currentRow.eachCell({ includeEmpty: true }, cell => {
                cell.border = {
                    top: { style: 'double' },
                    left: { style: 'double' },
                    bottom: { style: 'double' },
                    right: { style: 'double' }
                };
            });
        }

        const excelPath = "public/files/excel-evaluation"
        if (!fs.existsSync(excelPath)) fs.mkdirSync(excelPath, { recursive: true });

        const pathWorkbook = `${excelPath}/${evalData.id}-${evalData.employee_id}-${new Date().getMonth() + 1}.xlsx`
        workbook.xlsx.writeFile(pathWorkbook).then(() => {
            console.log('Excel Evaluation finished');
        });

        return pathWorkbook
    }

    createMonthly = async (data) => {
        let { month_id, division_id } = data
        if (!month_id) month_id = new Date().getMonth()
        const employeeData = await this.employeeDao.getEmployeeForEvaluation(data, month_id)
        if (employeeData.length < 1) return responseHandler.returnError(httpStatus.BAD_REQUEST, "No data need to be generated");

        let currentAcademicYear = await this.academicYearDao.getHighestAcademicYear()
        if (!currentAcademicYear) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to fetch current academic year employee evaluations");
        currentAcademicYear = currentAcademicYear.name

        const itemEvaluationDatas = await this.employeeEvaluationItemDao.getForCalculate(division_id)
        if (!itemEvaluationDatas) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to get calculation data");

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
        const jobdeskDatas = []
        await Promise.all(
            employeeEvaluationDatas.map(async (evaluation) => {
                await this.employeeDao.updateById(
                    { current_evaluation_id: evaluation.id },
                    evaluation.employee_id
                );

                itemEvaluationDatas.map((data) => (
                    jobdeskDatas.push(
                        {
                            name: data.name,
                            description: data.description,
                            unit_id: data.unit_id,
                            division_id: data.division_id,
                            grading_id: data.grading_id,
                            uid: `${evaluation.id}|${data.id}`,
                            evaluation_id: evaluation.id,
                            employee_id: evaluation.employee_id
                        }
                    )
                ));
            })
        )
        const itemEvaluationDatasCreated = await this.employeeJobdeskDao.bulkCreate(jobdeskDatas)
        if (!itemEvaluationDatasCreated) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to create jobdesk");
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
