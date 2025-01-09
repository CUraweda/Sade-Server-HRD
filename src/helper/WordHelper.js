const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const fs = require('fs')
const path = require('path')
const { formatToIndonesianDate, calculateAndConvertToIndonesianWords } = require('../helper/utils');
const EmployeeSignatureDao = require('../dao/EmployeeSignatureDao')
const employeeSignatureDao = new EmployeeSignatureDao()

module.exports = class WordHelper {
    constructor(template_name) {
        this._word_path = path.join(__dirname, `../views/${template_name}.docx`)
        if (!fs.existsSync(this._word_path)) throw Error("Path didnt exist")
    }
    loadTemplate(imagePath) {
        const templateBuffer = fs.readFileSync(this._word_path);
        const zip = new PizZip(templateBuffer);
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
        });

        return doc;
    }

    async generateContractEmployee(data) {
        const { employer, applicant, contract_end_date } = data
        const doc = this.loadTemplate()

        const kepalaSekolahClusterBawah = await employeeSignatureDao.findOneByWhere({ headmaster_of: "TK", is_headmaster: true })
        const formatedContract = calculateAndConvertToIndonesianWords(new Date(), contract_end_date)
        doc.render({
            contractEndDate: formatToIndonesianDate(contract_end_date),
            employerFullName: employer?.employeesignatures ? employer.employeesignatures[0].signature_name :  employer.full_name,
            employerPob: employer.pob,
            employerDob: formatToIndonesianDate(applicant.dob),
            applicantFullName: applicant.full_name, 
            applicantPob: applicant.pob,
            applicantDob: formatToIndonesianDate(applicant.dob),
            currentDate: formatToIndonesianDate(new Date()),
            contractLength: formatedContract.length,
            contractLengthText: formatedContract.text,
            kepalaSekolahClusterBawah: kepalaSekolahClusterBawah ? kepalaSekolahClusterBawah.signature_name : "",
            isGuru: applicant.is_teacher != "G" ? "Karyawan" : "Guru"
        })
        return doc.getZip().generate({ type: "nodebuffer" })
    }
}