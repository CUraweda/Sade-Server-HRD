const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const EmployeeAttachment = models.employeeattachment;

class EmployeeAttachmentDao extends SuperDao {
    constructor() {
        super(EmployeeAttachment);
    }

    async getCount(filter) {
        let { search } = filter
        if (!search) search = ""
        return EmployeeAttachment.count({
            where: {
                [Op.or]: [
                    {
                        employee_id: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        file_path: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        file_name: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        file_type: { [Op.like]: "%" + search + "%" },
                    },
                ],
            },
        });
    }

    async getPage(offset, limit, filter) {
        let { search } = filter
        if (!search) search = ""
        return EmployeeAttachment.findAll({
            where: {
                [Op.or]: [
                    {
                        employee_id: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        file_path: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        file_name: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        file_type: { [Op.like]: "%" + search + "%" },
                    },
                ],
            },
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
        });
    }
}

module.exports = EmployeeAttachmentDao;
