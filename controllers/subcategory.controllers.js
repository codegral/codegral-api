const Category = require("../models/categories/Category");
const Subcategory = require("../models/categories/subcategory/Subcategory");
const Response = require("../utils/Response");

const {
  isSubcategoryValid,
  isParentCategoryValid,
} = require("../utils/helpers/category.helpers");
const { createAppError } = require("../utils/helpers/error.helpers");

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

exports.createSubcategory = async function (req, res, next) {
  try {
    const { subcategory_parents, subcategory_name } = req.body;

    const categoriesPromise = subcategory_parents.map(async function (
      subcategory_parent
    ) {
      let category;
      category = await Category.findOne({
        category_name: subcategory_parent,
      });

      if (!category) {
        if (isParentCategoryValid(subcategory_parent)) {
          console.log(
            `Category ${subcategory_parent} didn't exist, but was created.`
          );

          category = await Category.create({
            category_name: subcategory_parent,
          });
        } else
          return next(
            createAppError(
              404,
              "fail",
              `Parent category ${subcategory_parent} is invalid.`
            )
          );
      }

      if (!isSubcategoryValid(category.category_name, subcategory_name)) {
        await Category.findByIdAndDelete(category._id);
        console.log(
          `Category ${subcategory_parent} was removed due to an error on sub category.`
        );

        return next(
          createAppError(
            404,
            "fail",
            `Subcategory ${subcategory_name} cannot be under Category ${category.category_name}.`
          )
        );
      }

      return category;
    });

    const categories = await Promise.all(categoriesPromise);

    let subcategory;

    if (categories)
      subcategory = await Subcategory.create({
        subcategory_parents: categories.map((category) => category._id),
        subcategory_name,
      });

    if (subcategory) {
      categories.forEach(async function (category) {
        category.category_subcategories.push(subcategory._id);
        await category.save();
      });
    }

    Response.send(
      res,
      201,
      "success",
      `Subcategory ${subcategory_name} under the category ${[
        ...subcategory_parents,
      ].join(", ")} has been created.`,
      undefined,
      { subcategory }
    );
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
      "The subcategory has been updated.",
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
