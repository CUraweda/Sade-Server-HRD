const express = require("express");
const EmployeeAnnouncementController = require("../controllers/EmployeeAnnouncementController");
const EmployeeAnnouncementValidator = require("../validator/EmployeeAnnouncementValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const employeeAnnouncementController = new EmployeeAnnouncementController();
const employeeAnnouncementValidator = new EmployeeAnnouncementValidator();


router.get(
    "/",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    employeeAnnouncementController.getAll
)
router.get(
    "/for-me",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    employeeAnnouncementController.getAll
)
router.get(
    "/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    employeeAnnouncementController.getOne
)

router.post(
    "/create",
    employeeAnnouncementValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    employeeAnnouncementController.createOne
)

router.put(
    "/update/:id",
    employeeAnnouncementValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    employeeAnnouncementController.update
)

router.delete(
    "/delete/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    employeeAnnouncementController.delete
)

module.exports = router;
