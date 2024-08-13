const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const ApplicantForm = models.applicantform;
const ApplicantAcademic = models.applicantacademic
const ApplicantUnformal = models.applicantunformal
const ApplicantSkill = models.applicantskill
const ApplicantJob = models.applicantjob
const ApplicantAppreciation = models.applicantappreciation
const AppreciationAttachment = models.appreciationattachment

class ApplicantFormDao extends SuperDao {
    constructor() {
        super(ApplicantForm);
    }

    async getCount(filter) {
        let { search } = filter
        if (!search) search = ""
        return ApplicantForm.count({
            where: {
                [Op.or]: [
                    {
                        full_name: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        email: { [Op.like]: "%" + search + "%" },
                    },
                ],
            },
        });
    }

    async getPage(offset, limit, filter) {
        let { search } = filter
        if (!search) search = ""
        return ApplicantForm.findAll({
            where: {
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
}

module.exports = ApplicantFormDao;
