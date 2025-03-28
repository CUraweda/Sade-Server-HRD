const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op, where } = require("sequelize");
const { required } = require("joi");

const ApplicantForm = models.applicantform;
const ApplicantAcademic = models.applicantacademic
const ApplicantUnformal = models.applicantunformal
const ApplicantSkill = models.applicantskill
const ApplicantJob = models.applicantjob
const JobVacancy = models.jobvacancy
const ApplicantAppreciation = models.applicantappreciation
const AppreciationAttachment = models.appreciationattachment
const User = models.user

class ApplicantFormDao extends SuperDao {
    constructor() {
        super(ApplicantForm);
    }

    async getCount(filter) {
        let { search, status, division_id, start_date, end_date } = filter
        if (!search) search = ""
        return ApplicantForm.count({
            where: {
                ...((start_date && end_date) && { createdAt: { [Op.between]: [start_date, end_date] } }),
                ...(status && { status }),
                [Op.or]: [
                    {
                        full_name: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        email: { [Op.like]: "%" + search + "%" },
                    },
                ],
            },
            include: [
                ...(division_id ? [
                    {
                        model: JobVacancy,
                        where: { division_id },
                        required: true
                    }
                ] : [])
            ]
        });
    }

    async getPage(offset, limit, filter) {
        let { search, status, division_id, start_date, end_date } = filter
        if (!search) search = ""
        return ApplicantForm.findAll({
            where: {
                ...(status && { status }),
                [Op.or]: [
                    {
                        full_name: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        email: { [Op.like]: "%" + search + "%" },
                    },
                ],
                ...((start_date && end_date) && { createdAt: { [Op.between]: [start_date, end_date] } })
            },
            include: [
                ...(division_id ? [
                    {
                        model: JobVacancy,
                        where: { division_id },
                        required: true
                    }
                ] : []),
                {
                    model: ApplicantAcademic,
                    required: false
                },
                {
                    model: ApplicantAppreciation,
                    required: false,
                    include: [
                        {
                            model: AppreciationAttachment,
                            required: false
                        }
                    ]
                },
                {
                    model: ApplicantJob,
                    required: false
                },
                {
                    model: ApplicantSkill,
                    required: false
                },
                {
                    model: ApplicantUnformal,
                    required: false
                }
            ],
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
        });
    }

    async getByVacancy(vacancy_id, filter) {
        let { search, is_passed, is_passed_interview, status } = filter
        if (!search) search = ""
        return ApplicantForm.findAll({
            where: {
                vacancy_id,
                ...(status && { status }),
                ...(is_passed != undefined && { is_passed }),
                ...(is_passed_interview != undefined && { is_passed_interview }),
                [Op.and]: [
                    {
                        full_name: { [Op.like]: "%" + search + "%" }
                    }
                ]
            },
        })
    }

    async getAggregationData(id) {
        return ApplicantForm.findOne({
            where: { id },
            include: [
                {
                    model: JobVacancy,
                    required: false
                },
                {
                    model: ApplicantAcademic,
                    required: false,
                    order: [["end_date", "DESC"]]
                }
            ]
        })
    }

    async getByRange(start_date, end_date) {
        return ApplicantForm.findAll({
            where: {
                created_at: {
                    [Op.between]: [start_date, end_date]
                }
            },
        })
    }

    async countRange(start_date, end_date) {
        return ApplicantForm.count({
            where: {
                created_at: {
                    [Op.between]: [start_date, end_date]
                }
            },
        })
    }

    async getDetail(id) {
        return ApplicantForm.findOne({
            where: { id },
            include: [
                { model: ApplicantAcademic },
                { model: ApplicantUnformal },
                { model: ApplicantSkill },
                { model: ApplicantJob },
                { model: ApplicantAppreciation, include: [{ model: AppreciationAttachment }] },
            ]
        })
    }
}

module.exports = ApplicantFormDao;
