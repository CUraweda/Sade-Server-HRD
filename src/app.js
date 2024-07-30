const express = require("express");
const cors = require("cors");
const httpStatus = require("http-status");
const routes = require("./route");
const { errorConverter } = require("./middlewares/error");
const ApiError = require("./helper/ApiError");
const path = require("path")

process.env.PWD = process.cwd();
process.env.TZ = "Asia/Jakarta";

const app = express();

app.use(cors());
app.options("*", cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).send(`Congratulations! API is working in port ${process.env.PORT}`);
});
app.use("/stg-server2/api", routes);
app.use("/stg-server2/public", express.static(path.join(__dirname, '../public')));

app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});
app.use(errorConverter);
const db = require("./models");

// Uncomment this line if you want to sync database model
// db.sequelize.sync()

module.exports = app;
