const { CATEGORIES } = require("../../../consts/index.consts");

exports.isSubcategoryValid = (category, subcategory) =>
  CATEGORIES[category].includes(subcategory);
