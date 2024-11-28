const express = require("express");
const router = express.Router();

const {
  getContents,
  createContent,
  getContent,
} = require("../../controllers/content/content.controllers");

const {
  checkCategoryValid,
} = require("../../middlewares/category/category.middlewares");

const {
  checkSubcategoriesValid,
} = require("../../middlewares/subcategory/subcategory.middlewares");

router
  .route("/")
  .get(getContents)
  // * Category & Subcategory Validation Middleware
  .post(checkCategoryValid, checkSubcategoriesValid, createContent);

router.route("/:contentId").get(getContent);

module.exports = router;
