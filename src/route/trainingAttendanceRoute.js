const express = require("express");
const TrainingAttendanceController = require("../controllers/TrainingAttendanceController");
const TrainingAttendanceValidator = require("../validator/TrainingAttendanceValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const trainingAttendanceController = new TrainingAttendanceController();
const trainingAttendanceValidator = new TrainingAttendanceValidator();


router.get(
    "/",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    trainingAttendanceController.getAll
)
router.get(
    "/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    trainingAttendanceController.getOne
)

router.post(
    "/create",
    trainingAttendanceValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    trainingAttendanceController.createOne
)

router.put(
    "/update/:id",
    trainingAttendanceValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    trainingAttendanceController.update
)

router.delete(
    "/delete/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    trainingAttendanceController.delete
)

module.exports = router;
