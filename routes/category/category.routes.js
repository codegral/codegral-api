const express = require("express");
const router = express.Router();

const {
  getCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../../controllers/category.controllers");

router.route("/").get(getCategories).post(createCategory);

router
  .route("/:categoryId")
  .get(getCategory)
  .patch(updateCategory)
  .delete(deleteCategory);

// * Nested Route(s)
router.use("/sub/subcategories", require("./subcategory/subcategory.routes"));

module.exports = router;
