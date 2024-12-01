const express = require("express");
const router = express.Router();

const { checkApiKey } = require("../middlewares/index.middlewares");

// * API Key Middleware
router.use(checkApiKey);

// * Routes
router.use("/contents", require("./content/content.routes"));
router.use("/categories", require("./categories/category.routes"));

module.exports = router;
