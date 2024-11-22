const {
  getValidationErrorMessage,
  getDuplicateKeyValue,
  createAppError,
} = require("../utils/helpers/error.helpers");
const Response = require("../utils/Response");

// ! 403: Validation Error
function validationError(err) {
  const message = getValidationErrorMessage(err.message);
  return createAppError(403, "fail", message);
}

// ! 409: Duplicate Key Error
function duplicateKeyError(err) {
  if (err.keyValue.hasOwnProperty("content_title")) {
    const content_title = getDuplicateKeyValue(err.keyValue, "content_title");

    return createAppError(
      409,
      "fail",
      `Content ${content_title} is already exists.`
    );
  }

  if (err.keyValue.hasOwnProperty("category_name")) {
    const category_name = getDuplicateKeyValue(err.keyValue, "category_name");

    return createAppError(
      409,
      "fail",
      `Category ${category_name} is already exists.`
    );
  }

  if (err.keyValue.hasOwnProperty("subcategory_name")) {
    const subcategory_name = getDuplicateKeyValue(
      err.keyValue,
      "subcategory_name"
    );

    return createAppError(
      409,
      "fail",
      `Subcategory ${subcategory_name} is already exists.`
    );
  }
}

module.exports = function (err, req, res, next) {
  console.error(err);

  if (err.name === "ValidationError") err = validationError(err);
  if (err.code === 11000) err = duplicateKeyError(err);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  Response.send(res, err.statusCode, err.status, err.message);

  next();
};
