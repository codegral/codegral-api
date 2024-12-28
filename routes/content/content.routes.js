const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer({ storage: multer.memoryStorage() });

const { parseJSON } = require("../../middlewares/index.middlewares");

const {
  // createContentThumbnailImageBuffer,
  // createContentBodyImagesBuffer,
  createContentImagesBuffers,
} = require("../../middlewares/content/content.middlewares");

const {
  checkCategoriesValidity,
} = require("../../middlewares/category/category.middlewares");

const {
  checkSubcategoriesValidity,
} = require("../../middlewares/subcategory/subcategory.middlewares");

const {
  getContents,
  createContent,
  getContent,
} = require("../../controllers/content/content.controllers");

router
  .route("/")
  .get(getContents)
  .post(
    // Multer
    storage.fields([
      { name: "content_thumbnail_image", maxCount: 1 },
      { name: "content_body_images" },
    ]),

    // Content Images Middleware
    createContentImagesBuffers,

    // Parse JSON Middleware
    parseJSON,

    // Category Middleware(s)
    checkCategoriesValidity,
    checkSubcategoriesValidity,

    createContent
  );

router.route("/:contentId").get(getContent);

module.exports = router;
