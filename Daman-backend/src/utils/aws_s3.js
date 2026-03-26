import S3 from "aws-sdk/clients/s3.js";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const accessKeyId = process.env.S3_ACCESS_KEY_ID;
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
const region = process.env.S3_REGION;
const bucket = process.env.S3_BUCKET;

const s3 = new S3({
  accessKeyId,
  secretAccessKey,
  region,
  s3ForcePathStyle: true,
  signatureVersion: "v4",
  connectTimeout: 0,
  httpOptions: { timeout: 0 },
});

export const uploadToS3 = async (file, key) => {
  try {
    let fileContent;

    // Check if file is a buffer or a stream
    if (Buffer.isBuffer(file)) {
      // If file is already a buffer, use it directly
      fileContent = file;
    } else if (file instanceof ReadableStream) {
      // If file is a stream, read it into a buffer
      const chunks = [];
      for await (const chunk of file) {
        chunks.push(chunk);
      }
      fileContent = Buffer.concat(chunks);
    } else {
      throw new Error("Unsupported file format");
    }

    // Upload file to S3
    const upload = await s3
      .upload({
        Bucket: bucket,
        Key: key,
        Body: fileContent,
      })
      .promise();

    return upload.Location;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const deleteFromS3 = async (key) => {
  try {
    // Delete file from S3
    const response = await s3
      .deleteObject({
        Bucket: bucket,
        Key: key,
      })
      .promise();

    // console.log("Delete from S3 response:", response); 
    // console.log(`File ${key} deleted successfully from S3`);

    return response; 
  } catch (error) {
    console.error("Delete from S3 error:", error); 
    throw error; 
  }
};

export const extractKeyFromS3Url = (url) => {
  try {
    // Split the URL by "/"
    const parts = url.split("/");
    // Extract the key from the last part of the URL
    const key = parts[parts.length - 1];
    return key;
  } catch (error) {
    console.error("Error extracting key from S3 URL:", error);
    return null;
  }
};

export default s3;
