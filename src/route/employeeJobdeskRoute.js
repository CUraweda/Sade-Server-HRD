const express = require("express");
const EmployeeJobdeskController = require("../controllers/EmployeeJobdeskController");
const EmployeeJobdeskValidator = require("../validator/EmployeeJobdeskValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const employeeJobdeskController = new EmployeeJobdeskController();
const employeeJobdeskValidator = new EmployeeJobdeskValidator();


router.get(
    "/",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    employeeJobdeskController.getAll
)
router.get(
    "/difference-day/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    employeeJobdeskController.getDifferenceDay
),
router.get(
    "/recap-week-employee/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    employeeJobdeskController.getWeekRecap
),
router.get(
    "/recap-month-employee/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    employeeJobdeskController.getMonthRecap
)
router.get(
    "/recap-year-employee/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    employeeJobdeskController.getYearRecap
)
router.get(
    "/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    employeeJobdeskController.getOne
)

router.post(
    "/create",
    employeeJobdeskValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    employeeJobdeskController.createOne
)
router.post(
    "/create-bulk",
    employeeJobdeskValidator.createBulkValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    employeeJobdeskController.createBulk
)

router.put(
    "/finish/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    employeeJobdeskController.updateFinish
)
router.put(
    "/grade/:id",
    employeeJobdeskValidator.gradeValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    employeeJobdeskController.updateGrade
)
router.put(
    "/update/:id",
    employeeJobdeskValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    employeeJobdeskController.update
)

router.delete(
    "/delete/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    employeeJobdeskController.delete
)

module.exports = router;
