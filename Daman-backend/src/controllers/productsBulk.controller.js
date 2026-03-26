// controllers/productBulkController.js
import fs from "fs";
import csv from "csv-parser";
import Products from "../models/Products.model.js";
import Categories from "../models/Categoriesmodel.js";

export const bulkUploadProducts = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const results = [];
    const errors = [];
    const validProducts = [];

    // Read and parse CSV file
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        try {
          // Process each row
          for (let index = 0; index < results.length; index++) {
            const row = results[index];

            try {
              // Validate and transform the data
              const productData = await validateAndTransformProduct(
                row,
                index + 1,
              );
              validProducts.push(productData);
            } catch (error) {
              errors.push({
                row: index + 2, // +2 because of header row and 0-based index
                message: error.message,
                data: row,
              });
            }
          }

          // If there are validation errors, return them
          if (errors.length > 0) {
            // Clean up uploaded file
            fs.unlinkSync(req.file.path);

            return res.status(400).json({
              success: false,
              message: "Validation failed",
              errors: errors.map((err) => `Row ${err.row}: ${err.message}`),
              summary: {
                totalRows: results.length,
                validRows: validProducts.length,
                errorRows: errors.length,
              },
            });
          }

          // Bulk insert valid products
          const insertedProducts = await Products.insertMany(validProducts, {
            ordered: false, // Continue even if some inserts fail
          });

          // Clean up uploaded file
          fs.unlinkSync(req.file.path);

          return res.status(200).json({
            success: true,
            message: "Products uploaded successfully",
            totalUploaded: insertedProducts.length,
            totalProcessed: results.length,
          });
        } catch (error) {
          // Clean up uploaded file
          if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
          }

          return res.status(500).json({
            success: false,
            message: "Error processing CSV file",
            error: error.message,
          });
        }
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Helper function to validate and transform product data
const validateAndTransformProduct = async (row, rowNumber) => {
  // Check required fields
  const requiredFields = [
    "categoryName",
    "prd_Name",
    "display_price",
    "selling_price",
    "description",
    "image",
    "quantity",
    "Type",
  ];

  for (const field of requiredFields) {
    if (!row[field] || row[field].trim() === "") {
      throw new Error(`Missing required field: ${field}`);
    }
  }
  // Find or validate category
  let category = await Categories.findOne({ CategoryName: row.categoryName });
  if (!category) {
    // Throw error if category must exist
    throw new Error(`Category "${row.categoryName}" not found`);
  }

  // Parse variants if present
  let variants = [];
  if (row.variants && row.variants.trim() !== "") {
    try {
      variants = JSON.parse(row.variants);

      // Validate each variant
      variants.forEach((variant, idx) => {
        if (
          !variant.quantity ||
          !variant.Type ||
          !variant.selling_Price ||
          !variant.display_price
        ) {
          throw new Error(`Variant at index ${idx} missing required fields`);
        }
      });
    } catch (error) {
      throw new Error(`Invalid variants JSON format: ${error.message}`);
    }
  }

  // Parse multiple images if present (assuming comma-separated URLs)
  let images = [];
  if (row.images && row.images.trim() !== "") {
    const imageUrls = row.images.split(",").map((url) => url.trim());
    images = imageUrls.map((url) => ({ image: url }));
  } else if (row.image) {
    images = [{ image: row.image }];
  }

  // Build product object
  const productData = {
    categoryId: category._id,
    categoryName: row.categoryName,
    prd_Name: row.prd_Name.trim(),
    display_price: parseFloat(row.display_price),
    selling_price: parseFloat(row.selling_price),
    description: row.description.trim(),
    image: row.image.trim(),
    quantity: parseInt(row.quantity),
    Type: row.Type.trim(),
    status: row.status ? row.status.toLowerCase() === "true" : true,
    hide: row.hide ? row.hide.toLowerCase() === "true" : false,
    images: images,
    variants: variants,
  };

  // Validate numeric fields
  if (isNaN(productData.display_price) || productData.display_price <= 0) {
    throw new Error("Display price must be a positive number");
  }

  if (isNaN(productData.selling_price) || productData.selling_price <= 0) {
    throw new Error("Selling price must be a positive number");
  }

  if (isNaN(productData.quantity) || productData.quantity < 0) {
    throw new Error("Quantity must be a non-negative number");
  }

  // Ensure selling price is not greater than display price
  if (productData.selling_price > productData.display_price) {
    throw new Error("Selling price cannot be greater than display price");
  }

  return productData;
};

// controllers/productBulkController.js (add this function)
export const downloadTemplate = async (req, res) => {
  try {
    const headers = [
      "categoryName",
      "prd_Name",
      "display_price",
      "selling_price",
      "description",
      "image",
      "quantity",
      "Type",
      "status",
      "hide",
      "images",
      "variants",
    ];

    const sampleData = [
      {
        categoryName: "Organic Fresh Vegetables",
        prd_Name: "Sample Product",
        display_price: "699",
        selling_price: "649",
        description: "Sample description",
        image: "sample.jpg",
        quantity: "100",
        Type: "electronics",
        status: "true",
        hide: "false",
        images: "image1.jpg,image2.jpg",
        variants:
          '[{"quantity":10,"Type":"black","selling_Price":649,"display_price":699,"description":"Black variant"}]',
      },
    ];

    const csv = [
      headers.join(","),
      ...sampleData.map((row) =>
        headers
          .map((header) => {
            const value = row[header] || "";
            // Escape commas and quotes in the value
            if (
              typeof value === "string" &&
              (value.includes(",") || value.includes('"'))
            ) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          })
          .join(","),
      ),
    ].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=product-upload-template.csv",
    );
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error generating template",
      error: error.message,
    });
  }
};
