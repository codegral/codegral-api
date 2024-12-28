const sharp = require("sharp");

exports.createContentImagesBuffers = async function (req, res, next) {
  try {
    if (
      req.files &&
      req.files["content_thumbnail_image"] &&
      req.files["content_body_images"]
    ) {
      req.content_thumbnail_image_buffer = await sharp(
        req.files["content_thumbnail_image"].at(0).buffer
      )
        .resize({
          width: 1200,
          height: 630,
          fit: "cover",
          position: "center",
          background: "#030a0e",
        })
        .toFormat("webp")
        .webp({ quality: 100 })
        .toBuffer();

      req.content_body_images_buffers = await Promise.all(
        req.files["content_body_images"].map(
          async (content_body_image) =>
            await sharp(content_body_image.buffer)
              .toFormat("webp")
              .webp({ quality: 100 })
              .toBuffer()
        )
      );

      return next();
    }
  } catch (e) {
    next(e);
  }
};

// exports.createContentThumbnailImageBuffer = async function (req, res, next) {
//   try {
//     console.log("Received content thumbnail.");
//     console.log("Content Thumbnail: ", req.files);

//     if (req.file && req.file.fieldname === "content_thumbnail_image") {
//       req.content_thumbnail_image_buffer = await sharp(req.file.buffer)
//         .resize({
//           width: 1200,
//           height: 630,
//           fit: "cover",
//           position: "center",
//         })
//         .toFormat("webp")
//         .webp({ quality: 100 })
//         .toBuffer();

//       return next();
//     }

//     next();
//   } catch (e) {
//     next(e);
//   }
// };

// exports.createContentBodyImagesBuffer = async function (req, res, next) {
//   try {
//     console.log("Received content body images.");
//     console.log("Content Body Images: ", req.files);

//     if (req.files) {
//     }

//     next();
//   } catch (e) {
//     next(e);
//   }
// };
