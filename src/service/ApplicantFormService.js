const httpStatus = require("http-status");
const constant = require("../config/constant");
const ApplicantFormDao = require("../dao/ApplicantFormDao");
const EmployeeDao = require("../dao/EmployeeDao");
const UserDao = require("../dao/UserDao");
const ApplicantAcademicService = require('../service/ApplicantAcademicService')
const ApplicantSkillService = require('../service/ApplicantSkillService')
const ApplicantJobService = require('../service/ApplicantJobService')
const ApplicantUnformalService = require('../service/ApplicantUnformalService')
const ApplicantAppreciationService = require('../service/ApplicantAppreciationService')
const EmailHelper = require('../helper/EmailHelper');

const responseHandler = require("../helper/responseHandler");
const ApplicantInterviewDao = require("../dao/ApplicantInterviewDao");
const JobVacancyDao = require("../dao/JobVacancyDao");
const config = require("../config/config");
const { warn } = require("winston");

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
        this.userDao = new UserDao()
        this.employeeDao = new EmployeeDao()
        this.emailHelper = new EmailHelper()
    }

    create = async (body) => {
        const applicantFormData = await this.applicantFormDao.create(body);
        if (!applicantFormData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to create applicant form");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Applicant form created successfully", applicantFormData);
    };

    evaluateApplication = async (id, condition, identifier, args) => {
        const { employee } = args
        // if (!employee) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Anda tidak termasuk karyawan");
        condition = condition != "lulus" ? false : true

        let body = {}
        switch (identifier) {
            case "Selection":
                body["is_passed_selection"] = condition
                body["status"] = condition ? constant.applicantSelectionEvaluation.success : constant.applicantSelectionEvaluation.fail
                break;
            case "Psychology":
                body["is_passed_psychological_test"] = condition
                body["status"] = condition ? constant.applicantPsychologyEvaluation.success : constant.applicantPsychologyEvaluation.fail
                body = {...body, ...args.body}
                break
            default:
                return responseHandler.returnError(httpStatus.BAD_REQUEST, "Identifier tidak sesuai");
        }

        console.log(body)

        const applicantExist = await this.applicantFormDao.findById(id)
        if (!applicantExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Applicant tidak ditemukan");

        if (condition) {
            setImmediate(async () => {
                await this.emailHelper.sendEvaluationEmail(applicantExist.email, {
                    applicant_name: applicantExist.full_name,
                    applicant_phone: applicantExist.phone,
                    status: "Lulus",
                    position_name: "Disembunyikan",
                    next_step: identifier != "Selection" ? "Mengikuti Psikotes" : "Mengikuti Interview",
                    sender_name: employee?.full_name || 'HRD',
                    sender_position: employee?.occupation || "",
                    sender_email: employee?.email || "",
                    sender_phone: employee?.phone || ""
                })
            })
        }

        const updatedData = await this.applicantFormDao.updateById(body, id)
        if (!updatedData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Gagal mengupdate data applicant");


        return responseHandler.returnSuccess(httpStatus.CREATED, "Seleksi berhasil dicatat", {});
    }

    createInterview = async (body, id, condition, employee) => {
        if (!employee)
            return responseHandler.returnError(
                httpStatus.BAD_REQUEST,
                "Anda tidak termasuk karyawan"
            );
        if (!condition)
            return responseHandler.returnError(
                httpStatus.BAD_REQUEST,
                "Kondisi Lulus atau Tidak Lulus tidak dispesifikan"
            );
        condition = condition.toLowerCase();
        const applicantExist = await this.applicantFormDao.findById(id);
        if (!applicantExist)
            return responseHandler.returnError(
                httpStatus.BAD_REQUEST,
                "Tidak ada data pada ID"
            );
        if (
            applicantExist.is_passed_interview ||
            applicantExist.is_passed_interview === false
        )
            return responseHandler.returnError(
                httpStatus.BAD_REQUEST,
                "Applicant Sudah Pernah melewati Seleksi Pertama"
            );

        if (condition === "lulus") {
            const uid = `${id}-${employee.id}`
            const applicantInterviewData = await this.applicantInterviewDao.create({ ...body, form_id: id, interviewer_id: employee.id, uid })
            if (!applicantInterviewData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Gagal dalam membuat Applicant Interview");

            // Send email for success condition
            await this.emailHelper.sendApplicantEmail(
                {
                    date: body.plan_date.toString().split(' ')[0],
                    time: body.plan_date.toString().split(' ')[1],
                    address: body.portal,
                    duration: '{{duration}}',
                    //applicant
                    applicantName: applicantExist.full_name,
                    applicantPosition: applicantExist.position,
                    //sender
                    senderName: employee.full_name,
                    senderPosition: employee.occupation,
                    senderPhone: employee.phone,
                    senderEmail: employee.email,
                },
                applicantExist.email,
                'Interview Invitation - Sekolah Alam Depok',
                '../views/applicant.html'
            )
        }

        let payloadData;
        if (condition !== "lulus") {
            payloadData = {
                is_passed_interview: false,
                is_passed: false,
                status: constant.applicantFirstEvaluation.fail,
            };

            // Send email for fail condition
            await this.emailHelper.sendApplicantEmail(
                {
                    status: condition,
                    positionName: employee.major,
                    //applicant
                    applicantName: applicantExist.full_name,
                    //sender
                    senderName: employee.full_name,
                    senderPosition: employee.occupation,
                    senderEmail: employee.email,
                    senderPhone: employee.phone,
                },
                applicantExist.email,
                `Hasil Wawancara - Sekolah Alam Depok`,
                '../views/applicant_error.html'
            );
        } else {
            payloadData = {
                is_passed_interview: true,
                status: constant.applicantFirstEvaluation.success
            };
        }
        const applicantFormData = await this.applicantFormDao.updateById(payloadData, id);
        if (!applicantFormData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Gagal mengupdate Applicant Form");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Seleksi berhasil dicatat", {});
    }

    createSecondEvalution = async (id, condition, body, employee) => {
        if (!employee) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Anda tidak termasuk karyawan");
        if (!condition) return responseHandler.returnError(httpStatus.BAD_REQUEST,"Kondisi Lulus atau Tidak Lulus tidak dispesifikan");
        const applicationExist = await this.applicantFormDao.getAggregationData(id);
        if (!applicationExist) return responseHandler.returnError(httpStatus.BAD_REQUEST,"Tidak ada data pada ID");

        if (!applicationExist.is_passed_interview)return responseHandler.returnError(httpStatus.BAD_REQUEST,"Applicant tidak lulus/belum melewati Seleksi Pertama");
        if (applicationExist.is_passed || applicationExist.is_passed === false)return responseHandler.returnError(httpStatus.BAD_REQUEST,"Applicant Sudah Pernah melewati Seleksi Kedua");

        let payload;
        condition = condition.toLowerCase();
        if (condition != "lulus") {
            payload = {
                is_passed: false,
                status: constant.applicantSecondEvaluation.fail,
            }

            // Send email for fail condition
            await this.emailHelper.sendApplicantEmail(
                {
                    status: condition,
                    positionName: employee.major,
                    //applicant
                    applicantName: applicationExist.full_name,
                    //sender
                    senderName: employee.full_name,
                    senderPosition: employee.occupation,
                    senderEmail: employee.email,
                    senderPhone: employee.phone,
                },
                applicationExist.email,
                `Hasil Wawancara - Sekolah Alam Depok`,
                '../views/applicant_error.html'
            );

        } else {
            await this.aggregateToEmployee(id, body);

            // Send email for success condition
            applicationExist['added_data'] = body
            applicationExist['hrd_data'] = employee
            await this.emailHelper.sendSecondEvaluation(applicationExist.email, applicationExist)

            payload = {
                is_passed: true,
                status: constant.applicantSecondEvaluation.success,
            }

        }
        // const applicantFormData = await this.applicantFormDao.updateById(payload, id);

        // if (!applicantFormData)
        //     return responseHandler.returnError(
        //         httpStatus.BAD_REQUEST,
        //         "Gagal mengupdate Applicant Form"
        //     );

        return responseHandler.returnSuccess(
            httpStatus.CREATED,
            "Seleksi berhasil dicatat",
            {}
        );
    };

    aggregateToEmployee = async (id, addedPayload) => {
        const applicantData = await this.applicantFormDao.getAggregationData(id);
        if (!applicantData)
            return responseHandler.returnError(
                httpStatus.BAD_REQUEST,
                "Tidak ada data pada ID"
            );
        if (applicantData.employee_id)
            return responseHandler.returnError(
                httpStatus.BAD_REQUEST,
                "Applicant sudah menjadi Employee"
            );

        let extra = { ...addedPayload },
            userData = {};
        const { applicantacademics, jobvacancy } = applicantData.dataValues;
        if (applicantacademics[0]) {
            const latestAcademicData = applicantacademics[0];
            extra["last_education"] = latestAcademicData.degree;
            extra["certificate_year"] = latestAcademicData?.end_date?.getFullYear();
            extra["is_education"] = latestAcademicData.is_kuliah ? "K" : "NK";
            extra["major"] = latestAcademicData.major;
        }

        if (jobvacancy) {
            extra["occupation"] = jobvacancy.sub_title;
            extra["is_teacher"] = jobvacancy.role != "GURU" ? "NG" : "G";
            extra["division_id"] = jobvacancy.division_id;
        }

        userData['role_id'] = jobvacancy.role != "GURU" ? 6 : 11 //TODO: DJSANJKDAJKNJK

        const { user_id, full_name, email, phone, nik, pob, dob, religion, martial_status } = applicantData.dataValues
        const payload = {
            user_id, full_name, email, phone, nik, pob, dob, religion, martial_status,
            ...extra, employee_status: "Probation", work_start_date: new Date().toISOString(), still_in_probation: true
        }
        const employeeData = await this.employeeDao.create(payload)
        if (!employeeData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Gagal membuat data employee")
        const updatedApplicant = await this.applicantFormDao.updateById({ employee_id: employeeData.id }, id)
        if (!updatedApplicant) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Gagal mengupdate data applicant")
        const updatedUser = await this.userDao.updateById({ avatar: applicantData.file_path, }, applicantData.user_id)
        if (!updatedUser) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Gagal mengupdate data user")
        await this.userDao.updateById(userData, applicantData.user_id)
        return responseHandler.returnSuccess(httpStatus.OK, "Berhasil Aggregasi Applicant", updatedApplicant)
    }

    createDataAndDetail = async (body) => {
        const { details } = body;
        delete body.details;

        const jobVacancyExist = await this.jobVacancyDao.checkAvailability(body.vacancy_id)
        if (!jobVacancyExist) return responseHandler.returnError(
            httpStatus.BAD_REQUEST,
            "Job Vacancy didnt exist or available"
        );


        const applicantFormData = await this.applicantFormDao.create({
            ...body,
            status: constant.firstApplicantFormStatus,
        });
        if (!applicantFormData)
            return responseHandler.returnError(
                httpStatus.BAD_REQUEST,
                "Failed to create applicant form"
            );

        const applicantDetailData = await this.createDetail(
            details,
            applicantFormData.id
        );
        if (!applicantDetailData.response.status)
            return responseHandler.returnError(
                httpStatus.BAD_REQUEST,
                "Gagal membuat data detail"
            );

        // await this.jobVacancyDao.updateCounter(applicantFormData.vacancy_id);
        return responseHandler.returnSuccess(
            httpStatus.OK,
            "Berhasil membuat Applicant Form dan Detail",
            applicantFormData
        );
    };

    createDetail = async (body, form_id) => {
        let { academic, job, unformal, appreciation, skill } = body;

        if (academic && academic.length > 0) {
            academic = academic.map((academicProp) => ({ form_id, ...academicProp }));
            await this.applicantAcademicService.createMany(academic).catch(() => {
                return responseHandler.returnError(
                    httpStatus.BAD_REQUEST,
                    "Gagal membuat detail Applicant Academic"
                );
            });
        }
        if (job && job.length > 0) {
            job = job.map((jobProp) => ({ form_id, ...jobProp }));
            await this.applicantJobService.createMany(job).catch(() => {
                return responseHandler.returnError(
                    httpStatus.BAD_REQUEST,
                    "Gagal membuat detail Applicant Job"
                );
            });
        }
        if (unformal && unformal.length > 0) {
            unformal = unformal.map((unformalProp) => ({ form_id, ...unformalProp }));
            await this.applicantUnformalService.createMany(unformal).catch(() => {
                return responseHandler.returnError(
                    httpStatus.BAD_REQUEST,
                    "Gagal membuat detail Applicant Unformal"
                );
            });
        }
        if (appreciation && appreciation.length > 0) {
            appreciation = appreciation.map((appreciationProp) => ({
                form_id,
                ...appreciationProp,
            }));
            await this.applicantAppreciationService
                .createManyWithAttachment(appreciation)
                .catch(() => {
                    return responseHandler.returnError(
                        httpStatus.BAD_REQUEST,
                        "Gagal membuat detail Applicant Appreciation"
                    );
                });
        }
        if (skill && skill.length > 0) {
            skill = skill.map((skillProp) => ({ form_id, ...skillProp }));
            await this.applicantSkillService.createMany(skill).catch(() => {
                return responseHandler.returnError(
                    httpStatus.BAD_REQUEST,
                    "Gagal membuat detail Applicant Skill"
                );
            });
        }

        return responseHandler.returnSuccess(
            httpStatus.CREATED,
            "Detail Data Applicant Form Berhasil dibuat"
        );
    };

    update = async (id, body) => {
        const dataExist = await this.applicantFormDao.findById(id);
        if (!dataExist)
            return responseHandler.returnError(
                httpStatus.BAD_REQUEST,
                "Applicant form not found"
            );

        const applicantFormData = await this.applicantFormDao.updateWhere(body, {
            id,
        });
        if (!applicantFormData)
            return responseHandler.returnError(
                httpStatus.BAD_REQUEST,
                "Failed to update applicant form"
            );

        return responseHandler.returnSuccess(
            httpStatus.OK,
            "Applicant form updated successfully",
            {}
        );
    };

    delete = async (id) => {
        const applicantFormData = await this.applicantFormDao.deleteByWhere({ id });
        if (!applicantFormData)
            return responseHandler.returnError(
                httpStatus.BAD_REQUEST,
                "Failed to delete applicant form"
            );

        return responseHandler.returnSuccess(
            httpStatus.OK,
            "Applicant form deleted successfully",
            {}
        );
    };

    showPage = async (page, limit, offset, filter) => {
        const totalRows = await this.applicantFormDao.getCount(filter);
        const totalPage = Math.ceil(totalRows / limit);

        const result = await this.applicantFormDao.getPage(offset, limit, filter);

        return responseHandler.returnSuccess(
            httpStatus.OK,
            "Applicant forms retrieved successfully",
            {
                result,
                page,
                limit,
                totalRows,
                totalPage,
            }
        );
    };

    showRekapDashboard = async () => {
        const currentDate = new Date();
        const currentMonth = (currentDate.getMonth() + 1)
            .toString()
            .padStart(2, "0");
        const currentYear = currentDate.getFullYear();
        const currentStart =
            currentDate.toISOString().split("T")[0] + "T00:00:00.000Z";
        const startDate = `${currentYear}-${currentMonth}-01T00:00:00.000Z`;

        const applicantFormData = await this.applicantFormDao.getByRange(
            startDate,
            currentDate.toISOString()
        );
        const applicantTodayData = await this.applicantFormDao.countRange(
            currentStart,
            currentDate.toISOString()
        );

        return responseHandler.returnSuccess(
            httpStatus.OK,
            "Applicant form found",
            {
                today_counter: applicantTodayData,
                month_counter: applicantFormData.length,
                data: applicantFormData,
            }
        );
    };

    showByVacancy = async (vacancy_id, filter) => {
        const applicantFormData = await this.applicantFormDao.getByVacancy(
            vacancy_id, filter
        );
        if (!applicantFormData)
            return responseHandler.returnError(
                httpStatus.BAD_REQUEST,
                "Applicant form not found"
            );

        return responseHandler.returnSuccess(
            httpStatus.OK,
            "Applicant form found",
            applicantFormData
        );
    };

    showDetail = async (id) => {
        const applicantFormData = await this.applicantFormDao.getDetail(id);
        if (!applicantFormData)
            return responseHandler.returnError(
                httpStatus.BAD_REQUEST,
                "Applicant form not found"
            );

        return responseHandler.returnSuccess(
            httpStatus.OK,
            "Applicant form found",
            applicantFormData
        );
    };

    showOne = async (id) => {
        const applicantFormData = await this.applicantFormDao.findById(id);
        if (!applicantFormData)
            return responseHandler.returnError(
                httpStatus.BAD_REQUEST,
                "Applicant form not found"
            );

        return responseHandler.returnSuccess(
            httpStatus.OK,
            "Applicant form found",
            applicantFormData
        );
    };
}

module.exports = ApplicantFormService;
