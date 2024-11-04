const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op, fn, col } = require("sequelize");

const EmployeeBill = models.employeebill;
const BillType = models.billtype
const Employees = models.employees
const EmployeeAccount = models.employeeaccount
class EmployeeBillDao extends SuperDao {
    constructor() {
        super(EmployeeBill);
    }

    async getCount(filter) {
        let { search, account_id } = filter
        if (!search) search = ""
        return EmployeeBill.count({
            where: {
                [Op.or]: [
                    { description: { [Op.like]: "%" + search + "%" } },
                    { amount: { [Op.like]: "%" + search + "%" } }
                ],
                ...(account_id && { account_id })
            },
        });
    }

    async getPage(offset, limit, filter) {
        let { search, account_id } = filter
        if (!search) search = ""
        return EmployeeBill.findAll({
            where: {
                [Op.or]: [
                    { description: { [Op.like]: "%" + search + "%" } },
                    { amount: { [Op.like]: "%" + search + "%" } }
                ],
                ...(account_id && { account_id })
            },
            include: [
                {
                    model: EmployeeAccount,
                    required: false,
                    include: [{ model: Employees, required: false }]
                }
            ],
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
        });
    }

    async getForSLipGjai(filter) {
        const { account_id } = filter
        return BillType.findAll({
            attributes: [
                'name', 'is_subtraction'
            ],
            include: [
                {
                    model: EmployeeBill,
                    required: true,
                    where: { account_id }
                }
            ],
            order: [["is_subtraction", "ASC"]]
        })
    }

    async getWithBillType(filter) {
        const { id, account_id } = filter
        return EmployeeBill.findOne({
            where: {
                ...(id && { id }),
                ...(account_id && { account_id }),
            },
            include: [
                {
                    model: BillType,
                    required: false
                },
                {
                    model: EmployeeAccount,
                    required: true
                }
            ]
        })
    }
}

module.exports = EmployeeBillDao;