const express = require("express");
const ApplicantUnformalController = require("../controllers/ApplicantUnformalController");
const ApplicantUnformalValidator = require("../validator/ApplicantUnformalValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const applicantUnformalController = new ApplicantUnformalController();
const applicantUnformalValidator = new ApplicantUnformalValidator();


router.get(
    "/",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    applicantUnformalController.getAll
)
router.get(
    "/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    applicantUnformalController.getOne
)

router.post(
    "/create",
    applicantUnformalValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    applicantUnformalController.createOne
)

router.put(
    "/update/:id",
    applicantUnformalValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    applicantUnformalController.update
)

router.delete(
    "/delete/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    applicantUnformalController.delete
)

module.exports = router;
