const httpStatus = require("http-status");
const constant = require('../config/constant')
const ApplicantFormDao = require("../dao/ApplicantFormDao");
const ApplicantAcademicService = require('../service/ApplicantAcademicService')
const ApplicantSkillService = require('../service/ApplicantSkillService')
const ApplicantJobService = require('../service/ApplicantJobService')
const ApplicantUnformalService = require('../service/ApplicantUnformalService')
const ApplicantAppreciationService = require('../service/ApplicantAppreciationService')

const responseHandler = require("../helper/responseHandler");
const ApplicantInterviewDao = require("../dao/ApplicantInterviewDao");
const JobVacancyDao = require("../dao/JobVacancyDao");

class ApplicantFormService {
    constructor() {
        this.applicantFormDao = new ApplicantFormDao();
        this.applicantInterviewDao = new ApplicantInterviewDao()
        this.applicantAcademicService = new ApplicantAcademicService()
        this.applicantSkillService = new ApplicantSkillService()
        this.applicantAppreciationService = new ApplicantAppreciationService()
        this.applicantJobService = new ApplicantJobService()
        this.applicantUnformalService = new ApplicantUnformalService()
        this.jobVacancyDao = new JobVacancyDao()
    }

    create = async (body) => {
        const applicantFormData = await this.applicantFormDao.create(body);
        if (!applicantFormData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to create applicant form");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Applicant form created successfully", applicantFormData);
    };

    createInterview = async (body, id, condition, employee) => {
        if (!employee) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Anda tidak termasuk karyawan");
        if (!condition) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Kondisi Lulus atau Tidak Lulus tidak dispesifikan");
        condition = condition.toLowerCase()
        const applicantExist = await this.applicantFormDao.findById(id)
        if (!applicantExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Tidak ada data pada ID");
        if (applicantExist.is_passed_interview || applicantExist.is_passed_interview === false) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Applicant Sudah Pernah melewati Seleksi Pertama");

        if (condition === "lulus") {
            const uid = `${id}-${employee.id}`
            const applicantInterviewData = await this.applicantInterviewDao.create({ ...body, form_id: id, interviewer_id: employee.id, uid })
            if (!applicantInterviewData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Gagal dalam membuat Applicant Interview"); console.log(applicantInterviewData)
        }

        const payloadData = condition != "lulus" ? {
            is_passed_interview: false,
            is_passed: false,
            status: constant.applicantFirstEvaluation.fail
        } : { is_passed_interview: true, status: constant.applicantFirstEvaluation.success }
        const applicantFormData = await this.applicantFormDao.updateById(payloadData, id);
        if (!applicantFormData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Gagal mengupdate Applicant Form");
        
        return responseHandler.returnSuccess(httpStatus.CREATED, "Seleksi berhasil dicatat", {});
    }
    
    createSecondEvalution = async (id, condition) => {
        if (!condition) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Kondisi Lulus atau Tidak Lulus tidak dispesifikan");
        condition = condition.toLowerCase()
        const applicationExist = await this.applicantFormDao.findById(id)
        if (!applicationExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Tidak ada data pada ID");
        if (applicationExist.is_passed || applicationExist.is_passed === false) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Applicant Sudah Pernah melewati Seleksi Kedua");
        
        const payloadData = condition != "lulus" ? {
            is_passed: false,
            status: constant.applicantSecondEvaluation.fail
        }: { is_passed: true, status: constant.applicantSecondEvaluation.success }
        const applicantFormData = await this.applicantFormDao.updateById(payloadData, id);
        if (!applicantFormData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Gagal mengupdate Applicant Form");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Seleksi berhasil dicatat", {});
    }

    createDataAndDetail = async (body) => {
        const { details } = body
        delete body.details

        const applicantFormData = await this.applicantFormDao.create({ ...body, status: constant.firstApplicantFormStatus });
        if (!applicantFormData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to create applicant form");

        const applicantDetailData = await this.createDetail(details, applicantFormData.id)
        if (!applicantDetailData.response.status) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Gagal membuat data detail");

        await this.jobVacancyDao.updateCounter(applicantFormData.vacancy_id)
        return responseHandler.returnSuccess(httpStatus.OK, "Berhasil membuat Applicant Form dan Detail", applicantFormData)
    }

    createDetail = async (body, form_id) => {
        let { academic, job, unformal, appreciation, skill } = body

        if (academic && academic.length > 0) {
            academic = academic.map((academicProp) => ({ form_id, ...academicProp }))
            await this.applicantAcademicService.createMany(academic).catch(() => { return responseHandler.returnError(httpStatus.BAD_REQUEST, "Gagal membuat detail Applicant Academic") })
        }
        if (job && job.length > 0) {
            job = job.map((jobProp) => ({ form_id, ...jobProp }))
            await this.applicantJobService.createMany(job).catch(() => { return responseHandler.returnError(httpStatus.BAD_REQUEST, "Gagal membuat detail Applicant Job") })
        }
        if (unformal && unformal.length > 0) {
            unformal = unformal.map((unformalProp) => ({ form_id, ...unformalProp }))
            await this.applicantUnformalService.createMany(unformal).catch(() => { return responseHandler.returnError(httpStatus.BAD_REQUEST, "Gagal membuat detail Applicant Unformal") })
        }
        if (appreciation && appreciation.length > 0) {
            appreciation = appreciation.map((appreciationProp) => ({ form_id, ...appreciationProp }))
            await this.applicantAppreciationService.createManyWithAttachment(appreciation).catch(() => { return responseHandler.returnError(httpStatus.BAD_REQUEST, "Gagal membuat detail Applicant Appreciation") })
        }
        if (skill && skill.length > 0) {
            skill = skill.map((skillProp) => ({ form_id, ...skillProp }))
            await this.applicantSkillService.createMany(skill).catch(() => { return responseHandler.returnError(httpStatus.BAD_REQUEST, "Gagal membuat detail Applicant Skill"); })
        }

        return responseHandler.returnSuccess(httpStatus.CREATED, "Detail Data Applicant Form Berhasil dibuat")
    }

    update = async (id, body) => {
        const dataExist = await this.applicantFormDao.findById(id);
        if (!dataExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Applicant form not found");

        const applicantFormData = await this.applicantFormDao.updateWhere(body, { id });
        if (!applicantFormData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to update applicant form");

        return responseHandler.returnSuccess(httpStatus.OK, "Applicant form updated successfully", {});
    };

    delete = async (id) => {
        const applicantFormData = await this.applicantFormDao.deleteByWhere({ id });
        if (!applicantFormData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to delete applicant form");

        return responseHandler.returnSuccess(httpStatus.OK, "Applicant form deleted successfully", {});
    };

    showPage = async (page, limit, offset, filter) => {
        const totalRows = await this.applicantFormDao.getCount(filter);
        const totalPage = Math.ceil(totalRows / limit);

        const result = await this.applicantFormDao.getPage(offset, limit, filter);

        return responseHandler.returnSuccess(httpStatus.OK, "Applicant forms retrieved successfully", {
            result,
            page,
            limit,
            totalRows,
            totalPage,
        });
    };

    showByVacancy = async (vacancy_id) => {
        const applicantFormData = await this.applicantFormDao.getByVacancy(vacancy_id)
        if (!applicantFormData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Applicant form not found");

        return responseHandler.returnSuccess(httpStatus.OK, "Applicant form found", applicantFormData);
    }

    showOne = async (id) => {
        const applicantFormData = await this.applicantFormDao.findById(id);
        if (!applicantFormData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Applicant form not found");

        return responseHandler.returnSuccess(httpStatus.OK, "Applicant form found", applicantFormData);
    };
}

module.exports = ApplicantFormService;
