const dotenv = require("dotenv");
const express = require("express");
const expressRateLimit = require("express-rate-limit");
const ExpressMongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const helmet = require("helmet");
const http = require("http");
const mongoose = require("mongoose");
const routes = require("./routes/index.routes");
const { createAppError } = require("./utils/helpers/error.helpers");
const errorController = require("./controllers/error.controller");

// * ENV
dotenv.config({ path: ".env" });

// * Express
const app = express();

// * Limit
const limit = expressRateLimit({
  max: 100,
  windowsMs: 60 * 60 * 1000,
  message: "Too many request!",
  standartHeaders: true,
  legacyHeaders: false,
});

app.use(express.json({ limit }));

// * Security
app.use(ExpressMongoSanitize());
app.use(hpp());
app.use(helmet());

// * Server
const server = http.createServer(app);

server.listen(process.env.PORT, "0.0.0.0", () =>
  console.log(
    `Server is started to listen for HTTP requests on PORT ${process.env.PORT}`
  )
);

// * MongoDB
(async function () {
  const ENVIRONMENT = process.env.ENVIRONMENT;

  try {
    await mongoose.connect(
      ENVIRONMENT === "dev"
        ? process.env.MONGODB_URL_DEV
        : process.env.MONGODB_URL_PROD
    );

    console.log(`Connection to the MongoDB (${ENVIRONMENT}) is successful.`);
  } catch (e) {
    console.error(`Connection to the MongoDB (${ENVIRONMENT}) is failed.`);
    console.error(e);
  }
})();

// * Routes
app.use("/", routes);

// ! Undefined Routes
app.all("*", (req, res, next) =>
  next(createAppError(404, "fail", `Undefined API Route: ${req.originalUrl}`))
);

// ! Error Handling
app.use(errorController);

// ! Uncaught Exception
process.on("uncaughtException", function (e) {
  console.error(e.name);
  console.error(e.message);

  server.close(() => process.exit(1));
});

// ! Unhandled Rejection
process.on("unhandledRejection", function (e) {
  console.error(e.name);
  console.error(e.message);

  server.close(() => process.exit(1));
});
