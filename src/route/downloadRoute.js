const express = require("express");
const DownloadController = require("../controllers/DownloadFileController");

const router = express.Router();
const auth = require("../middlewares/auth");

const downloadController = new DownloadController();


router.get(
    "/",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    downloadController.downloadFile
)

module.exports = router;
