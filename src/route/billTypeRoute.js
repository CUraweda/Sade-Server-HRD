const express = require("express");
const BillTypeController = require("../controllers/BillTypeController");
const BillTypeValidator = require("../validator/BillTypeValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const billTypeController = new BillTypeController();
const billTypeValidator = new BillTypeValidator();


router.get(
    "/",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    billTypeController.getAll
)
router.get(
    "/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    billTypeController.getOne
)

router.post(
    "/create",
    billTypeValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    billTypeController.createOne
)

router.put(
    "/update/:id",
    billTypeValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    billTypeController.update
)

router.delete(
    "/delete/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    billTypeController.delete
)

module.exports = router;
