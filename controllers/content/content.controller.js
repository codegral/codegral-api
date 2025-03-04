const Content = require("../../models/Content");
const Response = require("../../utils/Response");
const { AWS_REGION, AWS_BUCKET, AWS_S3 } = require("../../aws.s3.config");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const sharp = require("sharp");

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

    const content_thumbnail_buffer = req.content_thumbnail_buffer;
    const categories = req.categories;
    const subcategories = req.subcategories;

    const content = await Content.create({
      content_title,
      content_brief,
      content_body,
      // content_categories: categories.map((category) => category._id),
      // content_subcategories: subcategories?.map(
      //   (subcategory) => subcategory._id
      // ),
      content_meta_description,
      content_meta_keywords,
    });

    if (content_thumbnail_buffer) {
      const Key = `contents/${content._id}/thumbnail/${content._id}_thumbnail.webp`;

      const contentThumbnailParams = {
        Bucket: AWS_BUCKET,
        Key,
        Body: req.content_thumbnail_buffer,
        ContentType: "image/webp",
      };

      try {
        const putObjectCommand = new PutObjectCommand(contentThumbnailParams);
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

    const contentBodyImages = [
      ...content_body.matchAll(/<img src="data:image\/[^;]+;base64,([^"]+)"/g),
    ];

    if (contentBodyImages.length > 0) {
      const uploadedContentBodyImages = [];

      await Promise.all(
        contentBodyImages.map(async function ([, base64data], index) {
          const buffer = Buffer.from(base64data, "base64");
          const contentBodyImageBuffer = await sharp(buffer)
            .webp({ quality: 100 })
            .toBuffer();

          const Key = `contents/${content._id}/images/${content._id}_image_${index}.webp`;

          try {
            await AWS_S3.send(
              new PutObjectCommand({
                Bucket: AWS_BUCKET,
                Key,
                Body: contentBodyImageBuffer,
                ContentType: "image/webp",
              })
            );

            const content_body_image = `https://${AWS_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${Key}`;

            return uploadedContentBodyImages.push({
              base64: base64data,
              url: content_body_image,
            });
          } catch (e) {
            console.error("Error processing image:", e);
          }
        })
      );

      console.log("Uploaded Content Body Images: ", uploadedContentBodyImages);

      // uploadedContentBodyImages.forEach(({ base64, url }) => {
      //   const escapedBase64 = base64.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      //   content_body.replace(
      //     new RegExp(`data:image\\/[^;]+;base64,${escapedBase64}`),
      //     url
      //   );
      // });

      // content.content_body = content_body;
      // await content.save();
    }

    // Clear data on req object
    req.categories = undefined;
    req.subcategories = undefined;
    req.content_thumbnail_buffer = undefined;

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
