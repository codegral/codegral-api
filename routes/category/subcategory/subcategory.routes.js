const express = require("express");
const router = express.Router({ mergeParams: true });

const {
  getSubcategories,
  getSubcategory,
  updateSubcategory,
  deleteSubcategory,
} = require("../../../controllers/subcategory/subcategory.controllers");

router.route("/").get(getSubcategories);

router
  .route("/:subcategoryId")
  .get(getSubcategory)
  .patch(updateSubcategory)
  .delete(deleteSubcategory);

module.exports = router;
