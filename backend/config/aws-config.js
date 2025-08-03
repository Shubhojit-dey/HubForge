const AWS = require("aws-sdk");

AWS.config.update({
    region: "ap-south-1",
    accessKeyId: "AKIAU5LH6C2IEJGLIJV7",
    secretAccessKey: "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",
  });

const s3 = new AWS.S3();
const S3_BUCKET = "hubforge";

module.exports = { s3, S3_BUCKET };