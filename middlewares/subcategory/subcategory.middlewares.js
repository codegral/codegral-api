const Category = require("../../models/category/Category");
const Subcategory = require("../../models/subcategory/Subcategory");
const {
  isSubcategoryValid,
} = require("../../utils/helpers/subcategory/subcategory.helpers");
const { createAppError } = require("../../utils/helpers/error.helpers");

exports.checkSubcategoriesValidity = async function (req, res, next) {
  try {
    const { content_subcategories } = req.body;

    if (!content_subcategories || content_subcategories.length === 0)
      return next();

    const subcategories = await Promise.all(
      content_subcategories.map(async function (content_subcategory) {
        for (const category of req.categories) {
          if (!isSubcategoryValid(category.category_name, content_subcategory))
            return next(
              createAppError(
                422,
                "fail",
                `Subcategory ${content_subcategory} cannot be under Category ${category.category_name}.`
              )
            );

          const subcategory = await Subcategory.findOneAndUpdate(
            { subcategory_name: content_subcategory },
            { $addToSet: { subcategory_parents: category._id } },
            { upsert: true, new: true, runValidators: true }
          );

          if (!subcategory) {
            console.log(
              `Subcategory ${content_subcategory} could not created due to an error during the creation.`
            );

            return next(
              createAppError(
                400,
                "fail",
                `Subcategory ${content_subcategory} could not created due to an error during the creation.`
              )
            );
          }

          await Category.findByIdAndUpdate(
            category._id,
            {
              $addToSet: { category_subcategories: subcategory._id },
            },
            { upsert: true, new: true, runValidators: true }
          );

          return subcategory;
        }
      })
    );

    // Access granted
    req.subcategories = subcategories;

    next();
  } catch (e) {
    next(e);
  }
};
