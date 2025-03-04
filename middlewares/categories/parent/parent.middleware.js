exports.checkParentCategoriesValidity = async function (req, res, next) {
  try {
    const categories = await Promise.all(
      content_categories.map(async function (content_category) {
        const category = await Category.findOneAndUpdate(
          { category_name: content_category.parent_category },
          { $setOnInsert: { category_name: content_category.parent_category } },
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
