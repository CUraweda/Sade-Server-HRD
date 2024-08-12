const express = require("express");
const EmployeeSalaryController = require("../controllers/EmployeeSalaryController");
const EmployeeSalaryValidator = require("../validator/EmployeeSalaryValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const employeeSalaryController = new EmployeeSalaryController();
const employeeSalaryValidator = new EmployeeSalaryValidator();


router.get(
    "/",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    employeeSalaryController.getAll
)
router.get(
    "/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    employeeSalaryController.getOne
)

router.post(
    "/create",
    employeeSalaryValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    employeeSalaryController.createOne
)

router.put(
    "/update/:id",
    employeeSalaryValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    employeeSalaryController.update
)

router.delete(
    "/delete/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    employeeSalaryController.delete
)

module.exports = router;
