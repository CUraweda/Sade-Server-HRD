const express = require("express");
const cors = require("cors");
const passport = require("passport");
const httpStatus = require("http-status");
const routes = require("./route");
const { errorConverter, errorHandler } = require("./middlewares/error");
const { jwtStrategy } = require('./config/passport')
const ApiError = require("./helper/ApiError");
const path = require("path")

process.env.PWD = process.cwd();
process.env.TZ = "Asia/Jakarta";

const app = express();

app.use(cors());
app.options("*", cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

// jwt authentication
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);


app.get("/", async (req, res) => {
  res.status(200).send(`Congratulations! API is working in port ${process.env.PORT}`);
});
app.use("/stg-server1/api", routes);
app.use("/stg-server1/public", express.static(path.join(__dirname, '../public')));

app.use((req, res, next) => { next(new ApiError(httpStatus.NOT_FOUND, "Not found")); });
app.use(errorConverter);
app.use(errorHandler);
const db = require("./models");

// Uncomment this line if you want to sync database model
db.sequelize.sync()

module.exports = app;
