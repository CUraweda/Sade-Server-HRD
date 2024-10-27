const httpStatus = require("http-status");
const EmployeeAccountDao = require("../dao/EmployeeAccountDao");
const responseHandler = require("../helper/responseHandler");
const EmployeeSalaryDao = require("../dao/EmployeeSalaryDao");
const EmployeeBillDao = require("../dao/EmployeeBillDao");
const constant = require("../config/constant");
const EmployeeaccountDao = require("../dao/EmployeeAccountDao");

const PDFDocument = require('pdfkit-table');
const fs = require('fs');

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
            if(employeeaccounts.length > 0) continue
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

    generateSlipGaji = async () => {
        const doc = new PDFDocument({ margin: 30 });
      
        // Pipe the document to a file
        doc.pipe(fs.createWriteStream('slip-gaji.pdf'));
      
        // Add a title
        doc
          .fontSize(20)
          .text('Sekolah Alam Depok', { align: 'center' })
          .fontSize(12)
          .text('Jl. Bungsan No. 80 Bedahan, Sawangan', { align: 'center' })
          .text('Kota Depok      Telp. 081905252073', { align: 'center' })
          .moveDown();
      
        // Add Employee Information
        doc.text('Slip Gaji - Mei 2024', { align: 'center' });
        doc.moveDown(2);
        doc.text('Nama: Yudi Rahman', { align: 'left' });
        doc.text('Jabatan: Staf HR BPJS', { align: 'left' });
        doc.moveDown();
      
        // Create the table for PENDAPATAN and POTONGAN
        const table = {
          headers: ['PENDAPATAN', 'POTONGAN'],
          rows: [
            ['Gaji Pokok 2 bln', '500.000Rp'],
            ['Tunj. Tetap BPJS', '-Rp'],
            ['Tunj. Fungsional 2 bln', '-Rp'],
            ['Tunj. Transport 1 bln', '-Rp'],
            ['Tunj. Jabatan', '-Rp'],
            ['BPJS', '-Rp'],
            ['Kantin 1 bln', '-Rp'],
            ['Lain-lain', '-Rp'],
          ],
        };
      
        // Draw the table
        doc.table(table, { width: doc.page.width - 60 });
      
        // Create the table for FASILITAS and FASILITAS LAINNYA
        const fasilitasTable = {
          headers: ['FASILITAS', 'POTONGAN'],
          rows: [
            ['Kantin', '-Rp'],
            ['Gaji pokok', '-Rp'],
            ['Transport', '-Rp'],
            ['Pinjaman', '-Rp'],
            ['Koperasi', '-Rp'],
            ['Catering Anak', '-Rp'],
            ['Kegiatan Anak', '-Rp'],
          ],
        };
      
        // Draw the table
        doc.moveDown();
        doc.table(fasilitasTable, { width: doc.page.width - 60 });
      
        // Add summary
        doc.moveDown();
        doc.text('TOTAL PENDAPATAN: 500.000Rp', { align: 'left' });
        doc.text('TOTAL POTONGAN: -Rp', { align: 'left' });
        doc.text('GAJI BERSIH: 500.000Rp', { align: 'left' });
        
        // Add Signature and Date
        doc.moveDown(2);
        doc.text('* 0 Depok, 10 Juni 2024', { align: 'left' });
        doc.text('Adri Prima Leily', { align: 'left' });
        doc.text('Lima Ratus Ribu Rupiah', { align: 'left' });
      
        // End the document
        doc.end();
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

    updateTotal = async (account_id, bill_id, remove_data = false) => {
        const billExist = await this.employeeBillDao.getWithBillType(bill_id)
        if (!billExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Bill Data not found");

        const dataExist = await this.employeeAccountDao.findById(account_id);
        if (!dataExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "EmployeeAccount data not found");

        let payload = { 
             temp_total: billExist.billtype.is_subtraction ? remove_data ? dataExist.temp_total + billExist.amount : dataExist.temp_total - billExist.amount : remove_data ? dataExist.temp_total - billExist.amount : dataExist.temp_total + billExist.amount
         }
         console.log(billExist.billtype)
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

    showTotal = async (year, month) => {
        const employeeAccountData = await this.employeeAccountDao.getTotalRange(year, month)
        console.log(employeeAccountData)
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
