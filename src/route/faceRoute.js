const express = require("express");
const router = express.Router();
const faceController = require("../controllers/faceController");

router.post("/train", faceController.trainFace);

router.post("/detect", faceController.detectFace);

router.post("/check", faceController.checkFace);

router.get("/test", (req, res) => {
  res.send({ message: "Hello" });
});

module.exports = router;
