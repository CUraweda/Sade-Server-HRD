const express = require("express");
const DivisionController = require("../controllers/DivisionController");
const DivisionValidator = require("../validator/DivisionValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const divisionController = new DivisionController();
const divisionValidator = new DivisionValidator();


router.get(
    "/",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    divisionController.getAll
)
router.get(
    "/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    divisionController.getOne
)

router.post(
    "/create",
    divisionValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    divisionController.createOne
)

router.put(
    "/update/:id",
    divisionValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    divisionController.update
)

router.delete(
    "/delete/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    divisionController.delete
)

module.exports = router;
