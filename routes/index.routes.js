const express = require("express");
const router = express.Router();

const { checkApiKey } = require("../middlewares/index.middleware");

// * API Key Middleware
router.use(checkApiKey);

// * Routes
router.use("/contents", require("./content/content.routes"));
router.use("/categories", require("./categories/index.routes"));

module.exports = router;
