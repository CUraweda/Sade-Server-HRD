const httpStatus = require("http-status");
const EmployeeAccountDao = require("../dao/EmployeeAccountDao");
const responseHandler = require("../helper/responseHandler");
const EmployeeSalaryDao = require("../dao/EmployeeSalaryDao");
const EmployeeBillDao = require("../dao/EmployeeBillDao");
const constant = require("../config/constant");
const EmployeeaccountDao = require("../dao/EmployeeAccountDao");
const PDFGenerator = require("../config/pdf");
const EmailHelper = require("../helper/EmailHelper");
const emailHelper = new EmailHelper()
class EmployeeAccountService {
    constructor() {
        this.employeeAccountDao = new EmployeeAccountDao();
        this.employeeSalaryDao = new EmployeeSalaryDao()
        this.employeeBillDao = new EmployeeBillDao()
    }

    formatUID = (employee_id, month, year) => {
        return `${employee_id}|${month}-${year}`
    }

    create = async (body) => {
        const employeeAccountData = await this.employeeAccountDao.create(body);
        if (!employeeAccountData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "EmployeeAccount data could not be created");

        return responseHandler.returnSuccess(httpStatus.CREATED, "EmployeeAccount data successfully created", employeeAccountData);
    };

    createMonthly = async () => {
        const currentDate = new Date()
        const [currentMonth, currentYear] = [currentDate.getMonth() + 1, currentDate.getFullYear()]
        let payloadAccount = []

        let employeeSalarys = await this.employeeSalaryDao.getRangeWithEmployee(currentYear, currentMonth)
        if (employeeSalarys.length < 1) return responseHandler.returnError(httpStatus.BAD_REQUEST, "No Employee Salary to be created into Employee Account");
        for (let employeeSalary of employeeSalarys) {
            const { employee_id, fixed_salary, employeeaccounts } = employeeSalary
            if (employeeaccounts.length > 0) continue
            payloadAccount.push({
                salary_id: employeeSalary.id,
                employee_id,
                status: "Tunda",
                uid: this.formatUID(employee_id, currentMonth, currentYear),
                fixed_salary, temp_total: fixed_salary,
                month_id: currentMonth, year: currentYear
            })
        }
        if (payloadAccount.length < 1) return responseHandler.returnError(httpStatus.BAD_REQUEST, "No Employee Salary to be created into Employee Account");

        const employeeAccountData = await this.employeeAccountDao.bulkCreate(payloadAccount);
        if (!employeeAccountData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "EmployeeAccount bulk data could not be created");

        return responseHandler.returnSuccess(httpStatus.CREATED, "EmployeeAccount data successfully created", employeeAccountData);
    }

    async generateTabelDataSlipGaji(account_id, fixed_salary = 0) {
        const billData = await this.employeeBillDao.getForSLipGjai({ account_id })
        // let tableData = [[" Gaji Tetap", "", "", ""], ["Gaji Bulan Ini", fixed_salary, "", ""]], totalPendapatan = fixed_salary, totalPotongan = 0, currentPotonganIndex = 0
        const defaultObjectData = { title1: "", data1: "", title2: "", data2: "" }
        let tableData = [{ ...defaultObjectData, title1: "bold:Gaji Tetap" }, { ...defaultObjectData, title1: "Gaji Bulan Ini", data1: fixed_salary }], totalPendapatan = fixed_salary, totalPotongan = 0, currentPotonganIndex = 0
        billData.forEach(type => {
            const { employeebills } = type
            switch (type.is_subtraction) {
                case false:
                    tableData.push({ ...defaultObjectData, title1: `bold:${type.name}` })
                    if (employeebills.length < 1) break
                    employeebills.forEach(bill => {
                        tableData.push({ ...defaultObjectData, title1: bill.description, data1: bill.amount })
                        totalPendapatan += bill.amount
                    })
                    break;
                default:
                    if (!tableData[currentPotonganIndex]) {
                        tableData.push({ ...defaultObjectData, title2: `bold:${type.name}` })
                    } else tableData[currentPotonganIndex]['title2'] = `bold:${type.name}`
                    if (employeebills.length < 1) break
                    currentPotonganIndex++
                    employeebills.forEach(bill => {
                        if (!tableData[currentPotonganIndex]) {
                            tableData.push({ ...defaultObjectData, title2: bill.description, data2: bill.amount })
                        } else {
                            tableData[currentPotonganIndex]['title2'] = bill.description
                            tableData[currentPotonganIndex]['data2'] = bill.amount
                        }
                        totalPotongan += bill.amount
                        currentPotonganIndex++
                    })
                    break;
            }
        })
        return { tableData, totalPendapatan, totalPotongan }
    }

    async generateSlipGajiByEmployeeAccount(account_id) {
        const accountData = await this.employeeAccountDao.getDetail(account_id)
        const billData = await this.generateTabelDataSlipGaji(account_id, accountData.fixed_salary)

        return await PDFGenerator.generateSlipGaji(accountData, billData)
    }


    updatePaid = async (id) => {
        const dataExist = await this.employeeAccountDao.getDetail(id);
        if (!dataExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "EmployeeAccount data not found");
        if (dataExist.paid_amount === dataExist.temp_total) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Account already been paid");

        const pathCreatedPDF = await this.generateSlipGajiByEmployeeAccount(id)
        await emailHelper.sendSlipGaji(dataExist.employee.email, pathCreatedPDF)

        let payload = { paid_amount: dataExist.temp_total, is_paid: true, status: "Bayar" }
        const employeeAccountData = await this.employeeAccountDao.updateWhere(payload, { id });
        if (!employeeAccountData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "EmployeeAccount data could not be updated");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Account berhasil dibayar", {});
    }

    updateTotal = async (account_id, bill_id, remove_data = false) => {
        const billExist = await this.employeeBillDao.getWithBillType({ id: bill_id })
        if (!billExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Bill Data not found");

        const dataExist = await this.employeeAccountDao.findById(account_id);
        if (!dataExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "EmployeeAccount data not found");

        let payload = {
            temp_total: billExist.billtype.is_subtraction ? remove_data ? dataExist.temp_total + billExist.amount : dataExist.temp_total - billExist.amount : remove_data ? dataExist.temp_total - billExist.amount : dataExist.temp_total + billExist.amount
        }
        switch (billExist.billtype.name) {
            case "Koperasi":
                payload["cooperative"] = !remove_data ? dataExist.cooperative + billExist.amount : dataExist.cooperative - billExist.amount
                break;
            case "Pinjaman":
                payload["loan"] = !remove_data ? dataExist.loan + billExist.amount : dataExist.loan - billExist.amount
                break;
            case "Tunjangan":
                payload["variable_salary"] = !remove_data ? dataExist.variable_salary + billExist.amount : dataExist.variable_salary - billExist.amount
                break;
            case "Fasilitas":
                payload["facility"] = !remove_data ? dataExist.facility + billExist.amount : dataExist.facility - billExist.amount
                break;
            default:
                if(billExist.billtype.is_subtraction){
                    payload["other_cut"] = !remove_data ? dataExist.other_cut + billExist.amount : dataExist.other_cut - billExist.amount
                }else payload["other_income"] = !remove_data ? dataExist.other_income + billExist.amount : dataExist.other_income - billExist.amount
                break;
        }

        const employeeAccountData = await this.employeeAccountDao.updateWhere(payload, { id: account_id });
        if (!employeeAccountData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "EmployeeAccount data could not be updated");

        return responseHandler.returnSuccess(httpStatus.CREATED, "EmployeeAccount data successfully created", employeeAccountData);
    }

    update = async (id, body) => {
        const dataExist = await this.employeeAccountDao.findById(id);
        if (!dataExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "EmployeeAccount data not found");

        const employeeAccountData = await this.employeeAccountDao.updateWhere(body, { id });
        if (!employeeAccountData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "EmployeeAccount data could not be updated");

        return responseHandler.returnSuccess(httpStatus.OK, "EmployeeAccount data successfully updated", {});
    }

    delete = async (id) => {
        const employeeAccountData = await this.employeeAccountDao.deleteByWhere({ id });
        if (!employeeAccountData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "EmployeeAccount data could not be deleted");

        return responseHandler.returnSuccess(httpStatus.OK, "EmployeeAccount data successfully deleted", {});
    }

    showPage = async (page, limit, offset, filter) => {
        const totalRows = await this.employeeAccountDao.getCount(filter);
        const totalPage = Math.ceil(totalRows / limit);

        const result = await this.employeeAccountDao.getPage(offset, limit, filter);

        return responseHandler.returnSuccess(httpStatus.OK, "EmployeeAccount data successfully retrieved", {
            result, page, limit,
            totalRows: totalRows,
            totalPage: totalPage,
        });
    }

    showTotal = async (year, month) => {
        const employeeAccountData = await this.employeeAccountDao.getTotalRange(year, month)
        if (!employeeAccountData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "EmployeeAccount data not found");

        return responseHandler.returnSuccess(httpStatus.OK, "EmployeeAccount data found", employeeAccountData[0]);
    }

    showRecapYear = async (year) => {
        let monthMap = {}
        constant.monthList.forEach((month, i) => { monthMap[i + 1] = { name: month, total: 0 } })

        const employeeAccountDatas = await this.employeeAccountDao.getRange(year)
        if (!employeeAccountDatas) return responseHandler.returnError(httpStatus.BAD_REQUEST, "EmployeeAccount data not found");

        for (let employeeAccountData of employeeAccountDatas) monthMap[employeeAccountData.month_id].total += employeeAccountData.temp_total

        return responseHandler.returnSuccess(httpStatus.OK, "EmployeeAccount data found", Object.values(monthMap));
    }

showDetail = async (id) => {
        if (!id) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Please Provide an ID");
        const employeeAccountData = await this.employeeAccountDao.getDetail(id)
        if (!employeeAccountData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "EmployeeAccount data not found");

        const { employeebills } = employeeAccountData
        delete employeeAccountData.dataValues.employeebills

        let bills = {}
        for (let bill of employeebills) {
            const { name, is_subtraction } = bill.billtype
            if (!bills[name]) bills[name] = { name, subtraction: is_subtraction, total: 0, datas: [] }
            bills[name].total += bill.amount
            bills[name].datas.push(bill)
        }
        bills = Object.values(bills)

        return responseHandler.returnSuccess(httpStatus.OK, "EmployeeAccount data found", { account: employeeAccountData, bills });
    }

    showOne = async (id) => {
        const employeeAccountData = await this.employeeAccountDao.findById(id);
        if (!employeeAccountData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "EmployeeAccount data not found");

        return responseHandler.returnSuccess(httpStatus.OK, "EmployeeAccount data found", employeeAccountData);
    }
}

module.exports = EmployeeAccountService;
