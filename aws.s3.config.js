const { S3Client } = require("@aws-sdk/client-s3");

const AWS_REGION = process.env.AWS_REGION;
const AWS_BUCKET = process.env.AWS_BUCKET;

// * AWS S3 Config
const AWS_S3 = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  logger: {
    info: (message) => console.info("INFO: ", message),
    warn: (message) => console.warn("WARN: ", message),
    error: (message) => console.error("ERROR: ", message),
    debug: (message) => console.log("DEBUG: ", message),
  },
});

module.exports = { AWS_REGION, AWS_BUCKET, AWS_S3 };
