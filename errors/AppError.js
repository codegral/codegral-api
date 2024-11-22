module.exports = class AppError extends Error {
  constructor(statusCode, status, message) {
    // * Inheritance
    super(message);

    this.statusCode = statusCode;
    this.status = status;

    // Subscribing JavaScript Error Class
    Error.captureStackTrace(this, this.constructor);
  }
};
