const express = require("express");
const FormPositionController = require("../controllers/FormPositionController");
const FormPositionValidator = require("../validator/FormPositionValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const formPositionController = new FormPositionController();
const formPositionValidator = new FormPositionValidator();


router.get(
    "/",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    formPositionController.getAll
)
router.get(
    "/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    formPositionController.getOne
)

router.post(
    "/create",
    formPositionValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    formPositionController.createOne
)

router.put(
    "/update/:id",
    formPositionValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    formPositionController.update
)

router.delete(
    "/delete/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    formPositionController.delete
)

module.exports = router;
