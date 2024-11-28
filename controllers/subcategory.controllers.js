const Subcategory = require("../models/categories/subcategory/Subcategory");
const Category = require("../models/categories/Category");
const Response = require("../utils/Response");

exports.getSubcategories = async function (req, res, next) {
  try {
    const subcategories = await Subcategory.find();
    Response.send(res, 200, "success", undefined, subcategories.length, {
      subcategories,
    });
  } catch (e) {
    next(e);
  }
};

exports.getSubcategory = async function (req, res, next) {
  try {
    const { subcategoryId } = req.params;
    const subcategory = await Subcategory.findById(subcategoryId);

    Response.send(res, 200, "success", undefined, undefined, { subcategory });
  } catch (e) {
    next(e);
  }
};

exports.updateSubcategory = async function (req, res, next) {
  try {
    const { subcategoryId } = req.params;
    const { subcategory_name, subcategory_parents } = req.body;

    const subcategory = await Subcategory.findByIdAndUpdate(subcategoryId, {
      subcategory_name,
      subcategory_parents,
    });

    Response.send(
      res,
      201,
      "success",
      `Subcategory ${subcategory.subcategory_name} has been updated successfully.`,
      undefined,
      { subcategory }
    );
  } catch (e) {
    next(e);
  }
};

exports.deleteSubcategory = async function (req, res, next) {
  try {
    const { subcategoryId } = req.params;

    await Subcategory.findByIdAndDelete(subcategoryId);
    await Category.updateMany(
      { category_subcategories: subcategoryId },
      { $pull: { category_subcategories: subcategoryId } }
    );

    Response.send(res, 204, "success", "The subcategory has been deleted.");
  } catch (e) {
    next(e);
  }
};
