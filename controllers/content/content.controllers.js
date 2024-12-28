const Content = require("../../models/Content");
const Response = require("../../utils/Response");
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
    console.log("req.body: ", req.body);

    const {
      content_title,
      content_brief,
      content_body,
      content_meta_description,
      content_meta_keywords,
    } = req.body;

    const content_thumbnail_image_buffer = req.content_thumbnail_image_buffer;
    const content_body_images_buffers = req.content_body_images_buffers;
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

    if (content_thumbnail_image_buffer) {
      const Key = `contents/${content._id}/thumbnail/${content._id}_thumbnail.webp`;

      const thumbnailParams = {
        Bucket: AWS_BUCKET,
        Key,
        Body: req.content_thumbnail_image_buffer,
        ContentType: "image/webp",
      };

      try {
        const putObjectCommand = new PutObjectCommand(thumbnailParams);
        await AWS_S3.send(putObjectCommand);

        content.content_thumbnail = `https://${AWS_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${Key}`;
        await content.save();
      } catch (e) {
        console.error("Error uploading content thumbnail: ", e);

        await Content.findByIdAndDelete(content._id);
        return next(e);
      }
    } else {
      content.content_thumbnail = process.env.CONTENT_THUMBNAIL_DEFAULT;
      await content.save();
    }

    if (content_body_images_buffers) {
      let uploadedContentBodyImagesObjectURLS = [];
      const contentBodyImagesPromises = content_body_images_buffers.map(
        async function (content_body_image_buffer, index) {
          const Key = `contents/${content._id}/images/${content._id}_body_image_${index}.webp`;

          const bodyImageParams = {
            Bucket: AWS_BUCKET,
            Key,
            Body: content_body_image_buffer,
            ContentType: "image/webp",
          };

          try {
            uploadedContentBodyImagesObjectURLS.push(Key);
            return AWS_S3.send(new PutObjectCommand(bodyImageParams));
          } catch (e) {
            console.error("Error uploading content images: ", e);

            await Content.findByIdAndDelete(content._id);
            return next(e);
          }
        }
      );

      await Promise.all(contentBodyImagesPromises);
    }

    req.categories = undefined;
    req.subcategories = undefined;
    req.content_thumbnail_image_buffer = undefined;
    req.content_body_images_buffers = undefined;

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
