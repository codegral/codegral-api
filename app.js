// * ENV
const dotenv = require("dotenv");
dotenv.config({ path: `.env.dev` });

// * Initialize
const express = require("express");
const expressRateLimit = require("express-rate-limit");
const ExpressMongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const helmet = require("helmet");
const http = require("http");
const mongoose = require("mongoose");
const routes = require("./routes/index.routes");
const { createAppError } = require("./utils/helpers/error.helpers");
const errorController = require("./controllers/error/error.controller");

// * Express
const app = express();
app.use(express.json());

// * Limit
const limit = expressRateLimit({
  max: 100,
  windowsMs: 60 * 60 * 1000,
  message: "Too many request!",
  standartHeaders: true,
  legacyHeaders: false,
});

app.use(limit);

// * Security
app.use(ExpressMongoSanitize());
app.use(hpp());
app.use(helmet());

// * Server
const server = http.createServer(app);

server.listen(process.env.PORT, "0.0.0.0", function (err) {
  if (err) {
    console.error("Error starting server: ", err);
    server.close(() => process.exit(1));
  }

  console.log(
    `Server is started to listen for HTTP requests on PORT ${process.env.PORT}`
  );
});

// * MongoDB
(async function () {
  try {
    await mongoose.connect(process.env.MONGODB_URL);

    console.log(
      `Connection to the MongoDB (${process.env.NODE_ENV}) is successful.`
    );
  } catch (e) {
    console.error(
      `Connection to the MongoDB (${process.env.NODE_ENV}) is failed.`
    );

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
