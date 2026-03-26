import Products from "../models/Products.model.js";

// Add produts
export const createProducts = async (req, res) => {
  try {
    const { ...rest } = req.body;

    const newProducts = new Products({
      ...rest,
    });

    const response = await newProducts.save();
    res.status(200).json({
      code: 200,
      status: "Success!",
      message: "Product Added Successfuly",

      data: { results: response },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      code: 400,
      status: "Failed",
      data: { error: error.message },
    });
  }
};
// Get All Products
export const getAllProducts = async (req, res) => {
  try {
    const response = await Products.find();
    res.status(200).json({
      code: 200,
      status: "Success!",
      message: "Product List Successfuly",
      data: { length: response.length, results: response },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      code: 500,
      status: "An error occurred! Check server logs for more info.",
      data: {},
    });
  }
};
// Serch Products Api
export const searchProducts = async (req, res) => {
  try {
    // Extract search value from query
    const { searchValue } = req.query;

    // Build filter object to search both ProductName and ProductType
    const filter = {};
    if (searchValue) {
      filter.$or = [
        { prd_Name: { $regex: searchValue, $options: "i" } }, // Case-insensitive search
        { categoryName: { $regex: searchValue, $options: "i" } }, // Case-insensitive search
      ];
    }

    // Fetch filtered products from the database
    const response = await Products.find(filter);

    // Send the response
    res.status(200).json({
      code: 200,
      status: "Success!",
      message: "Product Data Successfuly",

      data: { length: response.length, results: response },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      code: 500,
      status: "An error occurred! Check server logs for more info.",
      data: { error: error.message },
    });
  }
};
// Get Product Details by ID API
export const getProductsById = async (req, res) => {
  try {
    const response = await Products.findById(req.params.ProductId);
    if (!response) {
      res
        .status(404)
        .json({ code: 404, status: "Product not found", data: {} });
      return;
    }

    // Calculate the percentage difference (DisplayPrice as the base)
    const displayPrice = response.DisplayPrice;
    const sellingPrice = response.SellingPrice;
    const percentage = ((displayPrice - sellingPrice) / displayPrice) * 100;

    // Add the percentage difference to the response data
    const responseData = {
      ...response.toObject(), // Convert Mongoose document to plain object
      percentage: percentage.toFixed(2), // Round to 2 decimal places
    };

    res.status(200).json({
      code: 200,
      status: "Success!",
      message: "Product Deatils Successfuly",
      data: { results: responseData },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      code: 500,
      status: "An error occurred! Check server logs for more info.",
      data: {},
    });
  }
};
// Update Prodcts by Product ID API
export const updateProductsById = async (req, res) => {
  try {
    const { ...rest } = req.body;

    // Prepare the update payload
    const updateData = {
      ...rest,
    };

    // Perform the update
    const response = await Products.findByIdAndUpdate(
      req.params.ProductId,
      updateData,
      { new: true } // Return the updated document
    );

    if (!response) {
      res
        .status(404)
        .json({ code: 404, status: "Product not found", data: {} });
      return;
    }

    res.status(200).json({
      code: 200,
      status: "Success!",
      message: "Product Update Successfuly",
      data: { results: response },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: 500,
      status: "An error occurred! Check server logs for more info.",
      data: {},
    });
  }
};
// Delete Products
export const deleteProductsById = async (req, res) => {
  try {
    // Find the product by ID
    const product = await Products.findById(req.params.ProductId);

    // If product not found, return 404
    if (!product) {
      return res
        .status(404)
        .json({ code: 404, status: "Product not found", data: {} });
    }

    // Delete the product from the database
    const deletedProduct = await Products.findByIdAndDelete(
      req.params.ProductId
    );

    // Respond with success message
    res.status(200).json({
      code: 200,
      status: "Success!",
      message: "Product Deleted Successfuly",
      data: { results: deletedProduct },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: 500,
      status: "An error occurred! Check server logs for more info.",
      data: {},
    });
  }
};
// Get Products By Categories ID
export const ProductsByCategory = async (req, res) => {
  try {
    const CategoryId = req.params.CategoryId;
    const page = req.query.page ? parseInt(req.query.page) : null;
    const limit = 6; // Number of products per request

    // Fetch products by category with pagination
    let response;
    if (page) {
      const skip = (page - 1) * limit;
      response = await Products.find(
        { categoryId: CategoryId, hide: false },
        { ratings: 0, reviews: 0 }
      )
        .sort({ order: 1 })
        .skip(skip)
        .limit(limit);
    } else {
      // fetch all products if no page is provided
      response = await Products.find(
        { categoryId: CategoryId, hide: false },
        { ratings: 0, reviews: 0 }
      ).sort({ order: 1 });
    }
    // Get total count for frontend pagination
    const totalCount = await Products.countDocuments({
      categoryId: CategoryId,
      hide: false,
    });

    res.status(200).json({
      code: 200,
      status: "Success!",
      message: "Data fetched successfully",
      data: {
        total: totalCount,
        page,
        totalPages: Math.ceil(totalCount / limit),
        results: response,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      code: 500,
      status: "An error occurred! Check server logs for more info.",
      data: {},
    });
  }
};

// Product List drop down Api
export const getAllProductsdrpdown = async (req, res) => {
  try {
    const response = await Products.find().select(
      "selling_price image prd_Name _id"
    );
    res.status(200).json({
      code: 200,
      status: "Success!",
      message: "Product List Successfully Retrieved",
      data: { length: response.length, results: response },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      code: 500,
      status: "An error occurred! Check server logs for more info.",
      data: {},
    });
  }
};
// Product Rating
export const ProductRatingUpdate = async (req, res) => {
  try {
    const { ProductId } = req.params;
    const { userId, rating, ordId } = req.body;

    // Find the Product by ID
    const Product = await Products.findById(ProductId);

    // If Product not found, return 404
    if (!Product) {
      return res.status(404).json({
        code: 404,
        status: "Product not found! Please select a valid Product.",
        data: {},
      });
    }

    // Check if the user has already rated the Product
    const existingRatingIndex = Product.ratings.findIndex(
      (r) => r.ordId?.toString() === ordId.toString()
    );

    if (existingRatingIndex !== -1) {
      // Update existing rating
      Product.ratings[existingRatingIndex].rating = rating;
    } else {
      // Add new rating
      Product.ratings.push({ userId, rating, ordId });
    }

    // Calculate the overall rating
    const totalRatings = Product.ratings.length;
    const sumRatings = Product.ratings.reduce((sum, r) => sum + r.rating, 0);
    Product.overallRating = (sumRatings / totalRatings).toFixed(1);

    // Save the updated Product
    await Product.save();

    // Return success response
    return res.status(200).json({
      code: 200,
      status: "Success!",
      data: { results: Product },
    });
  } catch (error) {
    // Handle errors
    console.error(error);
    return res.status(500).json({
      code: 500,
      status: "An error occurred! Check server logs for more info.",
      data: { error: error.message },
    });
  }
};
// Product Review
export const ProductReviewUpdate = async (req, res) => {
  try {
    const { ProductId } = req.params;
    const { userId, review, ordId } = req.body;

    // Find the Product by ID
    const Product = await Products.findById(ProductId);

    // If Product not found, return 404
    if (!Product) {
      return res.status(404).json({
        code: 404,
        status: "Product not found! Please select a valid Product.",
        data: {},
      });
    }

    // Check if the user has already reviewed the Product
    const existingReview = Product.reviews.find(
      (r) => r.ordId?.toString() === ordId.toString()
    );

    if (existingReview) {
      // User has already reviewed the Product
      return res.status(400).json({
        code: 400,
        status: "Failed!",
        message: "You have already given a review for this Order.",
        data: {},
      });
    }

    // User has not reviewed the Product, add a new review
    if (review !== undefined) {
      Product.reviews.push({ userId, review, ordId });
      Product.reviewscount += 1;
    }

    // Save the updated Product
    await Product.save();

    // Return success response
    return res.status(200).json({
      code: 200,
      status: "Success!",
      data: { results: Product },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      status: "An error occurred! Check server logs for more info.",
      data: { error: error.message },
    });
  }
};

// Product Hide and Unhide
export const PrdHideandunHide = async (req, res) => {
  try {
    const response = await Products.findById(req.params.ProductId);

    if (!response) {
      return res.status(404).json({
        code: 404,
        status: "Service not found",
        data: {},
      });
    }

    // Toggle the current status
    response.hide = !response.hide;

    // Save the updated document
    await response.save();

    res.status(200).json({
      code: 200,
      status: "Success!",
      message: `Product status updated`,
      data: { result: response },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      code: 500,
      status: "An error occurred! Check server logs for more info.",
      data: {},
    });
  }
};

// Update stock for a specific variant
export const updateVariantStock = async (req, res) => {
  try {
    const { productId, variantIndex } = req.params;
    const { inStock } = req.body; // Admin sends new stock quantity and optional inStock flag

    const product = await Products.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (!product.variants[variantIndex]) {
      return res.status(404).json({ message: "Variant not found" });
    }

    if (inStock !== undefined) {
      product.variants[variantIndex].inStock = inStock;
    } else {
      // Auto-handle if you want optional logic
      return res.status(404).json({ message: "Something went wrong" });
    }

    await product.save();

    res.status(200).json({
      code: 200,
      message: "Variant stock updated successfully",
      product: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Product Order Update
export const ProductsOrderUpdate = async (req, res) => {
  try {
    const { CategoryId, order_json } = req.body;

    // Validate inputs
    if (!CategoryId) {
      return res.status(400).json({
        code: 400,
        status: "Bad Request",
        message: "CategoryId is required",
      });
    }

    if (!Array.isArray(order_json) || order_json.length === 0) {
      return res.status(400).json({
        code: 400,
        status: "Bad Request",
        message: "order_json array is required",
      });
    }

    // Validate that CategoryId exists in products (check if any product has this category)
    const categoryExistsInProducts = await Products.findOne({
      categoryId: CategoryId,
    });
    if (!categoryExistsInProducts) {
      return res.status(404).json({
        code: 404,
        status: "Not Found",
        message: "No products found with the provided CategoryId",
      });
    }

    // Validate that all products belong to the specified category
    const productIds = order_json.map((item) => item.ProductId);
    const products = await Products.find({
      _id: { $in: productIds },
      categoryId: CategoryId,
    });

    if (products.length !== order_json.length) {
      return res.status(400).json({
        code: 400,
        status: "Bad Request",
        message: "Some products do not belong to the specified category",
      });
    }

    // Update all products in parallel
    const updatePromises = order_json.map((item) =>
      Products.findByIdAndUpdate(
        item.ProductId,
        { order: item.order },
        { new: true }
      )
    );

    await Promise.all(updatePromises);

    // Get all products from the same category after update, sorted by order
    const categoryProducts = await Products.find({
      categoryId: CategoryId,
    }).sort({ order: 1 });
    //   .select('_id prd_Name order categoryId categoryName image selling_price status hide');

    // Get category name from the first product (since all products in this query have same category)
    const categoryName =
      categoryProducts.length > 0 ? categoryProducts[0].categoryName : "";

    res.status(200).json({
      code: 200,
      status: "Success!",
      message: "Products order updated successfully for the category",
      data: {
        CategoryId: CategoryId,
        CategoryName: categoryName,
        totalProducts: categoryProducts.length,
        results: categoryProducts,
      },
    });
  } catch (error) {
    console.error("ProductsOrderUpdate Error:", error);
    res.status(500).json({
      code: 500,
      status: "An error occurred! Check server logs for more info.",
      data: {},
    });
  }
};
