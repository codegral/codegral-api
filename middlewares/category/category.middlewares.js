const Category = require("../../models/category/Category");
const { createAppError } = require("../../utils/helpers/error.helpers");

exports.checkCategoriesValidity = async function (req, res, next) {
  try {
    const { content_categories } = req.body;

    if (!content_categories || content_categories.length === 0)
      return next(
        createAppError(403, "fail", "Please specify a category name.")
      );

    const categories = await Promise.all(
      content_categories.map(async function (content_category) {
        const category = await Category.findOneAndUpdate(
          { category_name: content_category },
          { $setOnInsert: { category_name: content_category } },
          { upsert: true, new: true, runValidators: true }
        );

        return category;
      })
    );

    // Access granted
    req.categories = categories;

    next();
  } catch (e) {
    next(e);
  }
};
