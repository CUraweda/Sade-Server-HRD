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

// CORS
if (process.env.CORS_MODE === 'open') {
  app.use(cors());
  app.options('*', cors());
} else {
  const allowedOriginPattern = process.env.CORS_ORIGIN_REGEX || '';
  const allowedOriginRegex = allowedOriginPattern ? new RegExp(allowedOriginPattern, 'i') : null;
  const isOriginAllowed = (origin) => !!(allowedOriginRegex && allowedOriginRegex.test(origin));
  const isOriginMissingAllowed = process.env.CORS_ALLOW_MISSING_ORIGIN === 'true';
  const corsOptions = {
    origin(origin, cb) {
      if (!origin) return cb(null, isOriginMissingAllowed);
      if (isOriginAllowed(origin)) return cb(null, true);
      return cb(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-refresh-request'],
    credentials: true,
  };
  app.use((req, res, next) => {
    if (req.path.startsWith('/public') || req.path.startsWith('/training-attendance')) {
      return next();
    }
    const origin = req.get('origin');
    if (!origin && isOriginMissingAllowed) return next();
    if (origin && isOriginAllowed(origin)) return next();
    return res.status(403).json({ message: 'Forbidden' });
  });
  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions));
}

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// jwt authentication
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);


app.get("/", async (req, res) => {
  res.status(200).send(`Congratulations! API is working in port ${process.env.PORT}`);
});
app.use("/api", routes);
app.use("/public", express.static(path.join(__dirname, '../public')));
app.use("/training-attendance", express.static(path.join(__dirname, '../files/attendance')));

app.use((req, res, next) => { next(new ApiError(httpStatus.NOT_FOUND, "Not found")); });
app.use(errorConverter);
app.use(errorHandler);
const db = require("./models");

// Uncomment this line if you want to sync database model
db.sequelize.sync()

module.exports = app;

