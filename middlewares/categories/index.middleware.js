const { createAppError } = require("../../utils/helpers/error.helpers");

exports.checkCategoriesValidity = async function (req, res, next) {
  try {
    const { content_categories } = req.body;

    if (!content_categories || content_categories.length === 0)
      return next(
        createAppError(403, "fail", "Please specify a category name.")
      );

    // Grant Access
    req.categories = content_categories;

    next();
  } catch (e) {
    next(e);
  }
};
