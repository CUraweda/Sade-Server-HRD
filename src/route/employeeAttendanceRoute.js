const express = require("express");
const EmployeeAttendanceController = require("../controllers/EmployeeAttendanceController");
const EmployeeAttendanceValidator = require("../validator/EmployeeAttendanceValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const employeeAttendanceController = new EmployeeAttendanceController();
const employeeAttendanceValidator = new EmployeeAttendanceValidator();


router.get(
    "/",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    employeeAttendanceController.getAll
)
router.get(
    "/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    employeeAttendanceController.getOne
)

router.post(
    "/attend",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    employeeAttendanceController.createByToken
)
router.post(
    "/create",
    employeeAttendanceValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    employeeAttendanceController.createOne
)

router.put(
    "/update/:id",
    employeeAttendanceValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    employeeAttendanceController.update
)

router.delete(
    "/delete/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    employeeAttendanceController.delete
)

module.exports = router;
