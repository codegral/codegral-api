const express = require("express");
const router = express.Router({ mergeParams: true });

const {
  getSubcategories,
  createSubcategory,
  getSubcategory,
  updateSubcategory,
  deleteSubcategory,
} = require("../../../controllers/subcategory.controllers");

router.route("/").get(getSubcategories).post(createSubcategory);

router
  .route("/:subcategoryId")
  .get(getSubcategory)
  .patch(updateSubcategory)
  .delete(deleteSubcategory);

module.exports = router;
