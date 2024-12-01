const Category = require("../../models/category/Category");
const Subcategory = require("../subcategory/subcategory.controllers");
const Response = require("../../utils/Response");

exports.getCategories = async function (req, res, next) {
  try {
    const categories = await Category.find();
    Response.send(res, 200, "success", undefined, categories.length, {
      categories,
    });
  } catch (e) {
    next(e);
  }
};

exports.getCategory = async function (req, res, next) {
  try {
    const { categoryId } = req.params;
    const category = await Category.findById(categoryId);

    Response.send(res, 200, "success", undefined, undefined, { category });
  } catch (e) {
    next(e);
  }
};

exports.updateCategory = async function (req, res, next) {
  try {
    const { categoryId } = req.params;
    const { category_name, category_subcategories } = req.body;

    const category = await Category.findByIdAndUpdate(categoryId, {
      category_name,
      category_subcategories,
    });

    Response.send(
      res,
      201,
      "success",
      `Category ${category.category_name} has been updated successfully.`,
      undefined,
      { category }
    );
  } catch (e) {
    next(e);
  }
};

exports.deleteCategory = async function (req, res, next) {
  try {
    const { categoryId } = req.params;

    await Category.findByIdAndDelete(categoryId);
    await Subcategory.updateMany(
      { subcategory_parents: categoryId },
      { $pull: { subcategory_parents: categoryId } }
    );

    await Subcategory.deleteMany({
      subcategory_parents: { $size: 0 },
    });

    Response.send(res, 204, "success", "The category has been deleted.");
  } catch (e) {
    next(e);
  }
};
