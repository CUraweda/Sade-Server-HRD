const express = require("express");
const ApplicantInterviewController = require("../controllers/ApplicantInterviewController");
const ApplicantInterviewValidator = require("../validator/ApplicantInterviewValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const applicantInterviewController = new ApplicantInterviewController();
const applicantInterviewValidator = new ApplicantInterviewValidator();

router.get(
    "/",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    applicantInterviewController.getAll
)
router.get(
    "/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    applicantInterviewController.getOne
)

router.post(
    "/create",
    applicantInterviewValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    applicantInterviewController.createOne
)

router.put(
    "/update/:id",
    applicantInterviewValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    applicantInterviewController.update
)

router.delete(
    "/delete/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    applicantInterviewController.delete
)

module.exports = router;
