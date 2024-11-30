const Content = require("../../models/Content");
const Response = require("../../utils/Response");
const mongoose = require("mongoose");
const { AWS_REGION, AWS_BUCKET, AWS_S3 } = require("../../aws.s3.config");
const { PutObjectCommand } = require("@aws-sdk/client-s3");

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
      content_title,
      content_brief,
      content_body,
      content_meta_description,
      content_meta_keywords,
    } = req.body;

    const content_thumbnail_image_buffer = req.content_thumbnail_image_buffer;
    const categories = req.categories;
    const subcategories = req.subcategories;

    const content = await Content.create({
      content_title,
      content_brief,
      content_body,
      content_categories: categories.map((category) => category._id),
      content_subcategories: subcategories?.map(
        (subcategory) => subcategory._id
      ),
      content_meta_description,
      content_meta_keywords,
    });

    let thumbnailParams;
    if (content_thumbnail_image_buffer) {
      const Key = `contents/${content.content_slug}/thumbnail/${content.content_slug}_thumbnail.webp`;

      thumbnailParams = {
        Bucket: AWS_BUCKET,
        Key,
        Body: req.content_thumbnail_image_buffer,
        ContentType: req.file.mimetype,
      };

      try {
        const command = new PutObjectCommand(thumbnailParams);
        const response = await AWS_S3.send(command);

        content.content_thumbnail = `https://${AWS_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${Key}`;
        await content.save();

        console.log("Thumbnail has been uploaded successfully.");
        console.log("Response: ", response);
      } catch (e) {
        console.error("Error uploading file: ", e);

        await Content.findByIdAndDelete(content._id);

        return next(e);
      }
    } else {
      content.content_thumbnail = process.env.CONTENT_THUMBNAIL_DEFAULT;
      await content.save();
    }

    req.categories = undefined;
    req.subcategories = undefined;
    req.content_thumbnail_image_buffer = undefined;

    Response.send(
      res,
      201,
      "success",
      "Content has been created successfully.",
      undefined,
      { content }
    );
  } catch (e) {
    next(e);
  }
};
