const express = require("express");
const ApplicantFormController = require("../controllers/ApplicantFormController");
const ApplicantFormValidator = require("../validator/ApplicantFormValidator");
const UploadMiddleware = require("../middlewares/upload");

const router = express.Router();
const auth = require("../middlewares/auth");

const applicantFormController = new ApplicantFormController();
const applicantFormValidator = new ApplicantFormValidator();
const uploadMiddleware = new UploadMiddleware('applicantForm', [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
])

router.get(
    "/",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    applicantFormController.getAll
)
router.get(
    "/rekap-dashboard",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    applicantFormController.getRekapDashboard
)
router.get(
    "/by-vacancy/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    applicantFormController.getByVacancy
)
router.get(
    "/detail/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    applicantFormController.getDetail
)
router.get(
    "/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    applicantFormController.getOne
)

router.post(
    "/create",
    applicantFormValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    applicantFormController.createOne
)
router.post(
    "/first-evaluate/:condition/:id",
    applicantFormValidator.evaluateFirstValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    applicantFormController.evaluateFirst
)
router.post(
    "/second-evaluate/:condition/:id",
    applicantFormValidator.evaluateSecondValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    applicantFormController.evaluateSecond
)
router.post(
    "/send",
    uploadMiddleware.uploadFileMulti("files[]"),
    applicantFormValidator.sendFormValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    applicantFormController.sendData
)

router.put(
    "/update/:id",
    applicantFormValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    applicantFormController.update
)

router.delete(
    "/delete/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    applicantFormController.delete
)

module.exports = router;
