const express = require("express");
const router = express.Router();

const {
  getContents,
  createContent,
  getContent,
} = require("../../controllers/content.controllers");

const {
  checkCategoryValid,
} = require("../../middlewares/category/category.middleware");

const {
  checkSubcategoriesValid,
} = require("../../middlewares/subcategory/subcategory.middleware");

router
  .route("/")
  .get(getContents)
  // * Category & Subcategory Validation Middleware
  .post(checkCategoryValid, checkSubcategoriesValid, createContent);

router.route("/:contentId").get(getContent);

module.exports = router;
