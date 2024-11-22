module.exports = class Reponse {
  static send(res, statusCode, status, message, results, data) {
    res.status(statusCode).json({
      status,
      message,
      results,
      data,
    });
  }
};
