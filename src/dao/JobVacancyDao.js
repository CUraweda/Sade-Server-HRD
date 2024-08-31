const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const JobVacancy = models.jobvacancy;
const JobVacancyDetail = models.vacancydetail
const ApplicantForm = models.applicantform
const User = models.user
const Division = models.division

class JobVacancyDao extends SuperDao {
    constructor() {
        super(JobVacancy);
    }

    async getCount(filter) {
        let { search, division_id } = filter
        if (!search) search = ""
        return JobVacancy.count({
            where: {
                [Op.or]: [
                    {
                        title: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        sub_title: { [Op.like]: "%" + search + "%" },
                    },
                ],
                ...(division_id && { division_id })
            },
        });
    }

    async getPage(offset, limit, filter) {
        let { search, division_id } = filter
        if (!search) search = ""
        return JobVacancy.findAll({
            where: {
                [Op.or]: [
                    {
                        title: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        sub_title: { [Op.like]: "%" + search + "%" },
                    },
                ],
                ...(division_id && { division_id })
            },
            include: [
                {
                    model: JobVacancyDetail,
                    required: false
                },
                {
                    model: Division,
                    required: false
                },
                {
                    model: ApplicantForm,
                    required: false,
                    include: {
                        model: User,
                        required: false
                    }
                }
            ],
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
        });
    }

    async updateCounter(id) {
        const dataExist = await JobVacancy.findOne({ where: { id } })
        if (dataExist) return {}
        const payload = {
            applicant_count: dataExist.applicant_count++,
            ...(dataExist.applicant_count + 1 === dataExist.max_applicant && { is_open: false, status: "Pendaftaran Ditutup" })
        }
        return JobVacancy.updateById(payload, id)
    }
}

module.exports = JobVacancyDao;
