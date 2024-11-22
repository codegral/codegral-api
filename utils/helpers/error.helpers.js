const AppError = require("../../errors/AppError");

exports.getDuplicateKeyValue = (duplicateKey, duplicateValue) =>
  duplicateKey[duplicateValue];

exports.getValidationErrorMessage = (message) =>
  message
    .split(",")
    .map((message, index) => message.split(":").at(index === 0 ? 2 : 1))
    .join("")
    .trim();

exports.createAppError = (statusCode, status, message) =>
  new AppError(statusCode, status, message);
