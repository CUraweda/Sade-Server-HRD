const express = require("express");
const TrainingSuggestionController = require("../controllers/TrainingSuggestionController");
const TrainingSuggestionValidator = require("../validator/TrainingSuggestionValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const trainingSuggestionController = new TrainingSuggestionController();
const trainingSuggestionValidator = new TrainingSuggestionValidator();


router.get(
    "/",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    trainingSuggestionController.getAll
)
router.get(
    "/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    trainingSuggestionController.getOne
)

router.post(
    "/create",
    trainingSuggestionValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    trainingSuggestionController.createOne
)
router.post(
    "/request",
    trainingSuggestionValidator.requestValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    trainingSuggestionController.createRequest
)

router.put(
    "/approve/:id",
    trainingSuggestionValidator.approveValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    trainingSuggestionController.approveRequest
)

router.put(
    "/update/:id",
    trainingSuggestionValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    trainingSuggestionController.update
)

router.delete(
    "/delete/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    trainingSuggestionController.delete
)

module.exports = router;
