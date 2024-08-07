const express = require("express");
const ApplicantAcademicController = require("../controllers/ApplicantAcademicController");
const ApplicantAcademicValidator = require("../validator/ApplicantAcademicValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const applicantAcademicController = new ApplicantAcademicController();
const applicantAcademicValidator = new ApplicantAcademicValidator();


router.get(
    "/",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    applicantAcademicController.getAll
)
router.get(
    "/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    applicantAcademicController.getOne
)

router.post(
    "/create",
    applicantAcademicValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    applicantAcademicController.createOne
)

router.put(
    "/update/:id",
    applicantAcademicValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    applicantAcademicController.update
)

router.delete(
    "/delete/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    applicantAcademicController.delete
)

module.exports = router;
