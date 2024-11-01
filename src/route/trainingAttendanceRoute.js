const express = require("express");
const TrainingAttendanceController = require("../controllers/TrainingAttendanceController");
const TrainingAttendanceValidator = require("../validator/TrainingAttendanceValidator");

const router = express.Router();
const auth = require("../middlewares/auth");
const Upload = require("../middlewares/upload");

const trainingAttendanceController = new TrainingAttendanceController();
const trainingAttendanceValidator = new TrainingAttendanceValidator();
const uploadMiddleware = new Upload("attendance", [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
])

router.get(
    "/",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    trainingAttendanceController.getAll
)
router.get(
    "/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    trainingAttendanceController.getOne
)

router.post(
    "/attend-specific/:id",
    uploadMiddleware.uploadFileSingle('file'),
    trainingAttendanceValidator.attendCreateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    trainingAttendanceController.createByToken
)
router.post(
    "/attend-auto",
    uploadMiddleware.uploadFileMulti('files'),
    trainingAttendanceValidator.attendCreateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    trainingAttendanceController.createByToken
)
router.post(
    "/create",
    uploadMiddleware.uploadFileSingle('file'),
    trainingAttendanceValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    trainingAttendanceController.createOne
)

router.put(
    "/update/:id",
    trainingAttendanceValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    trainingAttendanceController.update
)

router.delete(
    "/delete/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    trainingAttendanceController.delete
)

module.exports = router;
