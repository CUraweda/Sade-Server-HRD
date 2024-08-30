const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const EmployeeBill = models.employeebill;
const BillType = models.billtype
const EmployeeAccount = models.employeeaccount
class EmployeeBillDao extends SuperDao {
    constructor() {
        super(EmployeeBill);
    }

    async getCount(filter) {
         let { search, account_id } = filter
        if(!search) search = ""
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
        if(!search) search = ""
        return EmployeeBill.findAll({
            where: {
                [Op.or]: [
                    { description: { [Op.like]: "%" + search + "%" } },
                    { amount: { [Op.like]: "%" + search + "%" } }
                ],
                ...(account_id && { account_id })
            },
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
        });
    }

    async getWithBillType(id) {
        return EmployeeBill.findOne({
            where: { id },
            include: [
                {
                    model: BillType,
                    required: true
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