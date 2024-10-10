const express = require("express");
const EmployeeAttendanceController = require("../controllers/EmployeeAttendanceController");
const EmployeeAttendanceValidator = require("../validator/EmployeeAttendanceValidator");
const UploadMiddleware = require("../middlewares/upload");

const router = express.Router();
const auth = require("../middlewares/auth");

const employeeAttendanceController = new EmployeeAttendanceController();
const employeeAttendanceValidator = new EmployeeAttendanceValidator();
const uploadMiddleware = new UploadMiddleware('attendance', [
    "application/pdf",
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
])

router.get(
    "/",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    employeeAttendanceController.getAll
)


router.get(
    "/recap-week",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    employeeAttendanceController.getRekapWeek
)
router.get(
    "/recap-month",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    employeeAttendanceController.getRekapMonth
)
router.get(
    "/recap-year",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    employeeAttendanceController.getRekapYearEmployee
)
router.get(
    "/recap-week-employee/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    employeeAttendanceController.getRekapWeekEmployee
)
router.get(
    "/recap-month-employee/:id?",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    employeeAttendanceController.getRekapMonthEmployee
)
router.get(
    "/recap-year-employee/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    employeeAttendanceController.getRekapYearEmployee
)
router.get(
    "/recap-calendar-by-token",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    employeeAttendanceController.getRekapCalendar
)
router.get(
    "/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    employeeAttendanceController.getOne
)

router.post(
    "/attend",
    uploadMiddleware.uploadFileSingle('file'),
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    employeeAttendanceController.createByToken
)

router.post(
    "/create",
    employeeAttendanceValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    employeeAttendanceController.createOne
)

router.put(
    "/update/:id",
    employeeAttendanceValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    employeeAttendanceController.update
)

router.delete(
    "/delete/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    employeeAttendanceController.delete
)

module.exports = router;
