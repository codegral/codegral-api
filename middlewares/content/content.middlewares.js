const sharp = require("sharp");

exports.createContentThumbnailImageBuffer = async function (req, res, next) {
  try {
    console.log("req.file: ", req.file);

    if (req.file && req.file.fieldname === "content_thumbnail_image") {
      req.content_thumbnail_image_buffer = await sharp(req.file.buffer)
        .resize({
          width: 1200,
          height: 675,
          fit: "cover",
        })
        .toFormat("webp")
        .webp({ quality: 100 })
        .toBuffer();

      return next();
    }

    next();
  } catch (e) {
    next(e);
  }
};

exports.createContentBodyImagesBuffer = async function (req, res, next) {
  try {
    if (req.files) {
    }

    next();
  } catch (e) {
    next(e);
  }
};
