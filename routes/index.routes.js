const express = require("express");
const router = express.Router();

const { checkApiKey } = require("../middlewares/index.middleware");

// * API Key Middleware
router.use(checkApiKey);

// * Routes
router.use("/contents", require("./content/content.routes"));
router.use("/categories", require("./category/category.routes"));

router.use(
  "/subcategories",
  require("./category/subcategory/subcategory.routes")
);

module.exports = router;
