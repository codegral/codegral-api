const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer({
  storage: multer.memoryStorage(),
  limits: {
    fieldSize: 10 * 1024 * 1024, // 10 MB
  },
});

const { parseJSON } = require("../../middlewares/index.middleware");

const {
  checkCategoriesValidity,
} = require("../../middlewares/categories/index.middleware");

const {
  createContentThumbnailBuffer,
} = require("../../middlewares/content/content.middleware");

const {
  getContents,
  createContent,
  getContent,
} = require("../../controllers/content/content.controller");

router.route("/").get(getContents).post(
  // Multer
  storage.single("content_thumbnail"),

  // Content Thumbnail Middleware
  createContentThumbnailBuffer,

  // Parse JSON Middleware
  parseJSON,

  // Category Middleware
  checkCategoriesValidity,

  // Launch the controller
  createContent
);

router.route("/:contentId").get(getContent);

module.exports = router;
