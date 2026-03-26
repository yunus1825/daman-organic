import express from "express";
import multer from "multer";
import { uploadToS3 } from "../utils/aws_s3.js";

const router = express.Router();
const upload = multer();

router.post("/", upload.single("file"), async (req, res) => {
  try {
    // Get file data from request
    const file = req.file;

    // Check if file is available
    if (!file) {
      return res.status(400).json({
        code: 400,
        status: "Bad Request",
        message: "File is required",
      });
    }

    // Generate a filename based on the current date and time
    const timestamp = new Date().toISOString().replace(/[-:]/g, '');
    const filename = `${timestamp}_${file.originalname}`;

    // Upload file to S3
    const imageUrl = await uploadToS3(file.buffer, filename);

    // Respond with S3 URL
    res.status(201).json({
      code: 201,
      status: "Success!",
      data: { results: imageUrl },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: 500,
      status: "An error occurred!",
      data: { error: error.message },
    });
  }
});

export default router;
