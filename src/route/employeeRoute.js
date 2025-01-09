const express = require("express");
const EmployeeController = require("../controllers/EmployeeController");
const EmployeeValidator = require("../validator/EmployeeValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const employeeController = new EmployeeController();
const employeeValidator = new EmployeeValidator();

router.post(
  "/create",
  auth([1, 5]),
  employeeValidator.employeeCreateUpdateValidator,
  employeeController.create
);
router.post(
  "/import",
  auth([1, 5]),
  employeeController.importExcel
);

router.put(
  "/update/:id",
  auth([1, 5]),
  employeeValidator.employeeCreateUpdateValidator,
  employeeController.update
);
router.put(
  "/outstation/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
  employeeValidator.outstationEmployeeValidator,
  employeeController.update
)
router.put(
  '/attach/:id',
  auth([1, 5]),
  employeeValidator.attachEmployeeValidator,
  employeeController.update
)
router.put(
  '/attach-division/:id',
  auth([1, 5]),
  employeeValidator.divisionEmployeeValidator,
  employeeController.update
)
router.put(
  '/finish-probation/:id',
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
  employeeController.finishProbation
)
router.put(
  '/contract/:id',
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
  employeeValidator.contractEmployeeValidator,
  employeeController.sendContract
)

router.get(
  "/show/:id",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
  employeeController.show
);
router.get(
  "/show-by-status",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
  employeeController.showAllIsGuru
);
router.get(
  "/me",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
  employeeController.showMe
)
router.get(
  "/me-attachment",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
  employeeController.showAttachment
)
router.get(
  "/detail/:id",
  auth([1, 2, 3, 4, 5, 6]),
  employeeController.showDetail
);
router.get(
  "/",
  auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
  employeeController.showAll
);

router.delete("/delete/:id", auth([1, 5]), employeeController.delete);


module.exports = router;
