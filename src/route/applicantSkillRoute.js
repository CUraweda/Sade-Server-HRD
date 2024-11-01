const express = require("express");
const ApplicantSkillController = require("../controllers/ApplicantSkillController");
const ApplicantSkillValidator = require("../validator/ApplicantSkillValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const applicantSkillController = new ApplicantSkillController();
const applicantSkillValidator = new ApplicantSkillValidator();


router.get(
    "/",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    applicantSkillController.getAll
)
router.get(
    "/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    applicantSkillController.getOne
)

router.post(
    "/create",
    applicantSkillValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    applicantSkillController.createOne
)

router.put(
    "/update/:id",
    applicantSkillValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    applicantSkillController.update
)

router.delete(
    "/delete/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    applicantSkillController.delete
)

module.exports = router;
