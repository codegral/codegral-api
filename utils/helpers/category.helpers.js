const { CATEGORIES } = require("../../consts/index.consts");

exports.isParentCategoryValid = (category) =>
  CATEGORIES.hasOwnProperty(category);

exports.isSubcategoryValid = (category, subcategory) =>
  CATEGORIES[category].includes(subcategory);
