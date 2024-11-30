const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer({ storage: multer.memoryStorage() });

const {
  getContents,
  createContent,
  getContent,
} = require("../../controllers/content/content.controllers");

const {
  checkCategoryValidity,
} = require("../../middlewares/category/category.middlewares");

const {
  checkSubcategoriesValidity,
} = require("../../middlewares/subcategory/subcategory.middlewares");

const {
  createContentThumbnailImageBuffer,
} = require("../../middlewares/content/content.middlewares");

router.route("/").get(getContents).post(
  // * Middleware(s)
  checkCategoryValidity,
  checkSubcategoriesValidity,
  // * Multer
  storage.single("content_thumbnail_image"),
  createContentThumbnailImageBuffer,
  createContent
);

router.route("/:contentId").get(getContent);

module.exports = router;
