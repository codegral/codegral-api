const sharp = require("sharp");

exports.createContentThumbnailBuffer = async function (req, res, next) {
  try {
    if (req.file && req.file.fieldname === "content_thumbnail")
      req.content_thumbnail_buffer = await sharp(req.file.buffer)
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

    next();
  } catch (e) {
    next(e);
  }
};
