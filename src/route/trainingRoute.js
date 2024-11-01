const express = require("express");
const TrainingController = require("../controllers/TrainingController");
const TrainingValidator = require("../validator/TrainingValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const trainingController = new TrainingController();
const trainingValidator = new TrainingValidator();


router.get(
    "/",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    trainingController.getAll
)
router.get(
    "/recap-dashboard",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    trainingController.getRecapDashboard
)
router.get(
    "/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    trainingController.getOne
)

router.post(
    "/create",
    trainingValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    trainingController.createOne
)

router.put(
    "/update/:id",
    trainingValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    trainingController.update
)

router.delete(
    "/delete/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    trainingController.delete
)

module.exports = router;
