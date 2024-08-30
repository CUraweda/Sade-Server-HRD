const httpStatus = require("http-status");
const EmployeeAccountDao = require("../dao/EmployeeAccountDao");
const responseHandler = require("../helper/responseHandler");
const EmployeeSalaryDao = require("../dao/EmployeeSalaryDao");
const EmployeeBillDao = require("../dao/EmployeeBillDao");

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

        const employeeSalarys = await this.employeeSalaryDao.getWithEmployee()
        if (employeeSalarys.length < 1) return responseHandler.returnError(httpStatus.BAD_REQUEST, "No Employee Salary to be created into Employee Account");
        for (let employeeSalary of employeeSalarys) {
            const { employee_id, fixed_salary } = employeeSalary
            payloadAccount.push({
                salary_id: employeeSalary.id,
                employee_id,
                status: "Tunda",
                uid: this.formatUID(employee_id, currentMonth, currentYear),
                fixed_salary, temp_total: fixed_salary,
                month_id: currentMonth, year: currentYear
            })
        }

        const employeeAccountData = await this.employeeAccountDao.bulkCreate(payloadAccount);
        if (!employeeAccountData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "EmployeeAccount bulk data could not be created");

        return responseHandler.returnSuccess(httpStatus.CREATED, "EmployeeAccount data successfully created", employeeAccountData);
    }

    updatePaid = async (id) => {
        const dataExist = await this.employeeAccountDao.findById(id);
        if (!dataExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "EmployeeAccount data not found");
        if (dataExist.paid_amount === dataExist.temp_total) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Account already been paid");

        let payload = { paid_amount: dataExist.temp_total, is_paid: true, status: "Bayar" }
        const employeeAccountData = await this.employeeAccountDao.updateWhere(payload, { id });
        if (!employeeAccountData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "EmployeeAccount data could not be updated");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Account berhasil dibayar", {});
    }

    updateTotal = async (account_id, bill_id) => {
        const billExist = await this.employeeBillDao.getWithBillType(bill_id)
        if (!billExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Bill Data not found");

        const dataExist = await this.employeeAccountDao.findById(account_id);
        if (!dataExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "EmployeeAccount data not found");

        let payload = { temp_total: billExist.billtype.is_subtraction ? dataExist.temp_total - billExist.amount : dataExist.temp_total + billExist.amount }
        switch (billExist.billtype.name) {
            case "Koperasi":
                payload["cooperative"] = dataExist.cooperative + billExist.amount
                break;
            case "Pinjaman":
                payload["loan"] = dataExist.loan + billExist.amount
                break;
            case "Tunjangan":
                payload["variable_salary"] = dataExist.variable_salary + billExist.amount
                break;
            default:
                return responseHandler.returnError(httpStatus.BAD_REQUEST, "Invalid Bill Type");
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

    showOne = async (id) => {
        const employeeAccountData = await this.employeeAccountDao.findById(id);
        if (!employeeAccountData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "EmployeeAccount data not found");

        return responseHandler.returnSuccess(httpStatus.OK, "EmployeeAccount data found", employeeAccountData);
    }
}

module.exports = EmployeeAccountService;
