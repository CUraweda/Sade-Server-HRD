const express = require("express");
const JobVacancyDetailController = require("../controllers/JobVacancyDetailController");
const JobVacancyDetailValidator = require("../validator/JobVacancyDetailValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const jobVacancyDetailController = new JobVacancyDetailController();
const jobVacancyDetailValidator = new JobVacancyDetailValidator();


router.get(
    "/",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    jobVacancyDetailController.getAll
)
router.get(
    "/by-vacancy/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    jobVacancyDetailController.getByVacancy
)
router.get(
    "/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    jobVacancyDetailController.getOne
)

router.post(
    "/create",
    jobVacancyDetailValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    jobVacancyDetailController.createOne
)

router.put(
    "/update/:id",
    jobVacancyDetailValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    jobVacancyDetailController.update
)

router.delete(
    "/delete/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    jobVacancyDetailController.delete
)

module.exports = router;
