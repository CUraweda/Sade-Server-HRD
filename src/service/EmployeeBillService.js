const httpStatus = require("http-status");
const EmployeeBillDao = require("../dao/EmployeeBillDao");
const responseHandler = require("../helper/responseHandler");
const EmployeeaccountDao = require("../dao/EmployeeAccountDao");
const EmployeeAccountService = require("./EmployeeAccountService");
const BillTypeDao = require("../dao/BillTypeDao");

class EmployeeBillService {
    constructor() {
        this.employeeBillDao = new EmployeeBillDao();
        this.employeeAccountDao = new EmployeeaccountDao()
        this.employeeAccountService = new EmployeeAccountService()
        this.billTypeDao = new BillTypeDao()
    }

    changeNameToIdentifier = (name, subtrac) => {
        switch (name) {
            case "Koperasi":
                return "cooperative"
            case "Pinjaman":
                return "loan"
            case "Tunjangan":
                return "variable_salary"
            case "Fasilitas":
                return "facility"
            default:
                return subtrac ? "other_cut" :  "other_income"
        }
    }

    create = async (body) => {
        const employeeBillData = await this.employeeBillDao.create(body);
        if (!employeeBillData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Employee Bill data could not be created");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Employee Bill data successfully created", employeeBillData);
    };

    addOne = async (employee_id, body) => {
        if (!employee_id) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Not an employee");
        const activeAccount = await this.employee_idAccountDao.getActive(employee_id)
        if (!activeAccount) return responseHandler.returnError(httpStatus.BAD_REQUEST, "No active account from this employee");

        body.account_id = activeAccount.id
        const employeeBillData = await this.employeeBillDao.create(body);
        if (!employeeBillData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Employee Bill data could not be created");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Employee Bill data successfully created", employeeBillData);
    }

    update = async (id, body) => {
        const dataExist = await this.employeeBillDao.getWithBillType({ id });
        if (!dataExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Employee Bill data not found");
        const { employeeaccount, billtype } = dataExist
        let payload = {}, identifierOld, identifierChange = { name: billtype.name, is_subtraction: billtype.is_subtraction }
        
        if (body.type_id && dataExist.type_id != body.type_id) {
            const billExist = await this.billTypeDao.findById(body.type_id)
            if (!billExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Bill Type data not found");
            identifierOld = this.changeNameToIdentifier(billtype.name, billtype.is_subtraction)
            payload[identifierOld] = employeeaccount[identifierOld] - dataExist.amount

            identifierChange = { name: billExist.name, is_subtraction: billExist.is_subtraction }
        }
        if (body.amount) {
            const amountDiff = dataExist.type_id != body.type_id ? body.amount :  body.amount - dataExist.amount
            identifierChange = this.changeNameToIdentifier(identifierChange.name, identifierChange.is_subtraction)
            payload[identifierChange] = employeeaccount[identifierChange] + amountDiff
        }
        if(Object.keys(payload).length > 0) {
            const updateAccount = await this.employeeAccountDao.hardUpdateCounter(dataExist.employeeaccount.id, payload)
            if (!updateAccount) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Employee Account Counter missmatch, please check");
        }

        const employeeBillData = await this.employeeBillDao.updateWhere(body, { id });
        if (!employeeBillData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Employee Bill data could not be updated");

        return responseHandler.returnSuccess(httpStatus.OK, "Employee Bill data successfully updated", {});
    }

    delete = async (id) => {
        const dataExist = await this.employeeBillDao.findById(id);
        if (!dataExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Employee Bill data not found");
        await this.employeeAccountService.updateTotal(dataExist.account_id, dataExist.id, true)

        const employeeBillData = await this.employeeBillDao.deleteByWhere({ id });
        if (!employeeBillData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Employee Bill data could not be deleted");
        return responseHandler.returnSuccess(httpStatus.OK, "Employee Bill data successfully deleted", {});
    }

    showPage = async (page, limit, offset, filter) => {
        const totalRows = await this.employeeBillDao.getCount(filter);
        const totalPage = Math.ceil(totalRows / limit);

        const result = await this.employeeBillDao.getPage(offset, limit, filter);

        return responseHandler.returnSuccess(httpStatus.OK, "Employee Bill data successfully retrieved", {
            result, page, limit,
            totalRows: totalRows,
            totalPage: totalPage,
        });
    }

    showOne = async (id) => {
        const employeeBillData = await this.employeeBillDao.findById(id);
        if (!employeeBillData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Employee Bill data not found");

        return responseHandler.returnSuccess(httpStatus.OK, "Employee Bill data found", employeeBillData);
    }
}

module.exports = EmployeeBillService;
