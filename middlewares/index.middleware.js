const Response = require("../utils/Response");

exports.checkApiKey = function (req, res, next) {
  try {
    const { API_KEY } = req.query;

    if (API_KEY === process.env.API_KEY) return next();

    console.error("Invalid API KEY!");

    Response.send(res, 401, "fail", "Invalid API KEY!");
  } catch (e) {
    next(e);
  }
};

exports.parseJSON = function (req, res, next) {
  try {
    Object.keys(req.body).forEach(function (key) {
      if (typeof req.body[key] === "string" && req.body[key] !== "") {
        try {
          req.body[key] = JSON.parse(req.body[key]);
        } catch (e) {
          console.error(`Error parsing ${key} with value ${req.body[key]}`);
          console.error(e);
        }
      }
    });

    next();
  } catch (e) {
    next(e);
  }
};
