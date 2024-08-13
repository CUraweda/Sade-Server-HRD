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

  filterFile(req, file, cb) { // Make this method public
    if (this.#allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb("Please upload only pdf and image file.", false);
    }
  }

  uploadFileSingle(fieldName) {
    console.log(this.#dir)
    const upload = multer({
      storage: this.#storage,
      limits: { fileSize: 5000000 },
      fileFilter: this.filterFile.bind(this), // Bind the method here
    }).single(fieldName);

    return util.promisify(upload); // Promisify multer's function directly
  }
  
  uploadFileMulti(fieldName) {
    console.log(this.#dir)
    const upload = multer({
      storage: this.#storage,
      limits: { fileSize: 5000000 },
      fileFilter: this.filterFile.bind(this), // Bind the method here
    }).array(fieldName);

    return util.promisify(upload); // Promisify multer's function directly
  }
}

module.exports = Upload;
