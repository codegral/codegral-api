const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer({ storage: multer.memoryStorage() });

const { parseJSON } = require("../../middlewares/index.middlewares");

const {
  createContentThumbnailImageBuffer,
} = require("../../middlewares/content/content.middlewares");

const {
  checkCategoryValidity,
} = require("../../middlewares/category/category.middlewares");

const {
  checkSubcategoriesValidity,
} = require("../../middlewares/subcategory/subcategory.middlewares");

const {
  getContents,
  createContent,
  getContent,
} = require("../../controllers/content/content.controllers");

router.route("/").get(getContents).post(
  // Multer
  storage.single("content_thumbnail_image"),

  // Thumbnail Middleware
  createContentThumbnailImageBuffer,

  // Parse JSON Middleware
  parseJSON,

  // Category Middleware(s)
  checkCategoryValidity,
  checkSubcategoriesValidity,

  createContent
);

router.route("/:contentId").get(getContent);

module.exports = router;
