const express = require("express");
const EmployeeAccountController = require("../controllers/EmployeeAccountController");
const EmployeeAccountValidator = require("../validator/EmployeeAccountValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const employeeAccountController = new EmployeeAccountController();
const employeeAccountValidator = new EmployeeAccountValidator();


router.get(
    "/",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    employeeAccountController.getAll
)
router.get(
    "/detail/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    employeeAccountController.getDetail
)
router.get(
    "/total-month",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    employeeAccountController.getMonthTotal
)
router.get(
    "/recap-year",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    employeeAccountController.getRecapYear
)
router.get(
    "/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    employeeAccountController.getOne
)

router.post(
    "/create-monthly",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    employeeAccountController.createMonthly
)
router.post(
    "/create",
    employeeAccountValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    employeeAccountController.createOne
)

router.put(
    "/paid/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    employeeAccountController.updatePaid
)
router.put(
    "/update/:id",
    employeeAccountValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    employeeAccountController.update
)

router.delete(
    "/delete/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    employeeAccountController.delete
)

module.exports = router;
