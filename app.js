// * ENV
const dotenv = require("dotenv");
dotenv.config({ path: `.env.dev` });

// * Initialize
const express = require("express");
const cors = require("cors");
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

// * Parse JSON
app.use(express.json());

// * Parse URL Encoded
app.use(express.urlencoded({ extended: true }));

// * CORS
app.use(cors({ origin: "*" }));

// * API Limit
app.use(
  expressRateLimit({
    max: 1000,
    windowsMs: 60 * 60 * 1000,
    message: "Too many request!",
    standartHeaders: true,
    legacyHeaders: false,
  })
);

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
    `Server is started to listen for HTTP requests in ${process.env.NODE_ENV} on PORT ${process.env.PORT}`
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
