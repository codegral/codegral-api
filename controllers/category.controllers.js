const Category = require("../models/categories/Category");
const Subcategory = require("../models/categories/subcategory/Subcategory");
const Response = require("../utils/Response");

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

exports.createCategory = async function (req, res, next) {
  try {
    const { category_name } = req.body;

    const category = await Category.create({
      category_name: category_name.toLowerCase(),
    });

    Response.send(
      res,
      201,
      "success",
      "Category has been created.",
      undefined,
      { category }
    );
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
      `The category has been updated.`,
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
