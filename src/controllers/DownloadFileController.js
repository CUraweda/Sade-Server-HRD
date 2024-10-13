const httpStatus = require("http-status");
const path = require("path");
const fs = require("fs");

class DownloadController {
    constructor() { }

    downloadFile= async (req, res) => {
        try {
            let filePath = req.query.filepath;

            if (!filePath) {
                return res.status(httpStatus.BAD_REQUEST).send({
                    status: false,
                    code: httpStatus.BAD_REQUEST,
                    message: "File path not provided.",
                });
            }

            filePath = "./" + filePath 

            console.log(filePath)

            if (fs.existsSync(filePath)) {
                const filename = path.basename(filePath);
                res.setHeader("Content-Type", "application/octet-stream");
                res.setHeader(
                    "Content-Disposition",
                    `attachment; filename="${filename}"`
                );

                const fileStream = fs.createReadStream(filePath);
                fileStream.pipe(res);
            } else {
                res.status(httpStatus.NOT_FOUND).send({
                    status: false,
                    code: httpStatus.NOT_FOUND,
                    message: "File not found.",
                });
            }
        } catch (e) {
            console.error(e);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
                status: false,
                code: httpStatus.INTERNAL_SERVER_ERROR,
                message: e.message,
            });
        }
    }
}

module.exports = DownloadController;
