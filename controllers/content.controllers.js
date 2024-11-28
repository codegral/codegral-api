const Content = require("../models/Content");
const Response = require("../utils/Response");

exports.getContents = async function (req, res, next) {
  try {
    const contents = await Content.find();
    Response.send(res, 200, "success", undefined, contents.length, {
      contents,
    });
  } catch (e) {
    next(e);
  }
};

exports.getContent = async function (req, res, next) {
  try {
    const { contentId } = req.params;
    const content = await Content.findById(contentId);

    Response.send(res, 200, "succes", undefined, undefined, { content });
  } catch (e) {
    next(e);
  }
};

exports.createContent = async function (req, res, next) {
  try {
    const {
      content_thumbnail,
      content_title,
      content_brief,
      content_body,
      content_categories,
      content_subcategories,
      content_meta_description,
      content_meta_keywords,
    } = req.body;

    const categories = req.categories;
    const subcategories = req.subcategories;

    req.categories = undefined;
    req.subcategories = undefined;

    Response.send(
      res,
      201,
      "success",
      "Content has been created successfully.",
      undefined,
      { categories, subcategories }
    );
  } catch (e) {
    next(e);
  }
};
