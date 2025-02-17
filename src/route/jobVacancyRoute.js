const express = require("express");
const JobVacancyController = require("../controllers/JobVacancyController");
const JobVacancyValidator = require("../validator/JobVacancyValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const jobVacancyController = new JobVacancyController();
const jobVacancyValidator = new JobVacancyValidator();


router.get(
    "/",
    // auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    jobVacancyController.getAll
)
router.get(
    "/show-division-recap",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13]),
    jobVacancyController.getRecapDivision
)
router.get(
    "/:id",
    // auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    jobVacancyController.getOne
)

router.post(
    "/create",
    jobVacancyValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    jobVacancyController.createOne
)
router.post(
    "/create-detail",
    jobVacancyValidator.createWithDetailValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    jobVacancyController.createWithDetail
)

router.put(
    "/close/:id",
    jobVacancyValidator.closeVacancyValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    jobVacancyController.closeVacancy
)
router.put(
    "/update/:id",
    jobVacancyValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    jobVacancyController.update
)

router.delete(
    "/delete/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    jobVacancyController.delete
)

module.exports = router;
