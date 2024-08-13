const util = require("util");
const multer = require("multer");
const path = require("node:path");
const fs = require("fs");

class Upload {
  #dir = './files/'
  #allowedMimes
  #storage

  constructor(directoryName, mimes) {
    this.#dir += directoryName
    this.#allowedMimes = mimes
    if (!fs.existsSync(this.#dir)) {
      fs.mkdirSync(this.#dir, { recursive: true });
    }
    const currentDirectory = this.#dir
    this.#storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, currentDirectory);
      },
      filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); //Appending extension
      },
    });
  }

  #filterFile(req, file, cb) {
    if (this.#allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb("Please upload only pdf and image file.", false);
    }
  }

  uploadFileSingle(fieldName) {
    return util.promisify(
      multer({
        storage: this.#storage,
        limits: { fileSize: 5000000 },
        fileFilter: this.#filterFile,
      }).single(fieldName)
    )
  }

  uploadFileMulti(fieldName) {
    return util.promisify(
      multer({
        storage: this.#storage,
        limits: { fileSize: 5000000 },
        fileFilter: this.#filterFile,
      }).array(fieldName)
    )
  }
}

module.exports = Upload
