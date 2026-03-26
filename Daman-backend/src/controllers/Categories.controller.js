import Categories from "../models/Categoriesmodel.js";
import cache from "../utils/cache.js";

// Add Categories
export const createCategories = async (req, res) => {
  try {
    const { CategoryName, Description, Image } = req.body;

    const value = {
      CategoryName,
      Description,
      Image,
      status: false,
    };

    const newCategories = new Categories(value);
    const response = await newCategories.save();
    cache.del("category_data");
    res.status(200).json({
      code: 200,
      status: "Success!",
      message: "Category Added successfully",
      data: { results: response },
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

// List All Categories
export const getAllCategories = async (req, res) => {
  const responseData = cache.get("category_data");
  if (responseData) {
    return res.status(200).json({
      code: 200,
      status: "Success!",
      message: "Category List successfully",
      data: { length: responseData.length, results: responseData },
    });
  }
  try {
    // Fetch categories sorted by "order" (ascending)
    const response = await Categories.find({ status: true }).sort({ order: 1 });
    cache.set("category_data", response);

    res.status(200).json({
      code: 200,
      status: "Success!",
      message: "Category List successfully",
      data: { length: response.length, results: response },
    });
  } catch (error) {
    console.error("getAllCategories Error:", error);
    res.status(500).json({
      code: 500,
      status: "An error occurred! Check server logs for more info.",
      data: {},
    });
  }
};

export const getAdminCategories = async (req, res) => {
  try {
    const response = await Categories.find().sort({ order: 1 });

    res.status(200).json({
      code: 200,
      status: "Success!",
      message: "Category List successfully",
      data: { length: response.length, results: response },
    });
  } catch (error) {
    console.error("getAdminCategories Error:", error);

    res.status(500).json({
      code: 500,
      status: "Server Error",
      data: {},
    });
  }
};

export const updateCategoryStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const response = await Categories.findByIdAndUpdate(
      req.params.CategoryId,
      { status },
      { new: true },
    );

    if (!response) {
      return res.status(404).json({
        code: 404,
        status: "Category not found",
        data: {},
      });
    }

    // clear cache
    cache.del("category_data");

    res.status(200).json({
      code: 200,
      status: "Success!",
      message: "Category status updated successfully",
      data: { results: response },
    });
  } catch (error) {
    console.error("updateCategoryStatus Error:", error);

    res.status(500).json({
      code: 500,
      status: "Server Error",
      data: {},
    });
  }
};

// Update Category
export const updateCategoryById = async (req, res) => {
  try {
    const response = await Categories.findByIdAndUpdate(
      req.params.CategoryId,
      req.body,
      { new: true },
    );
    if (!response) {
      res
        .status(404)
        .json({ code: 404, status: "Categories not found", data: {} });
      return;
    }
    cache.del("category_data");

    res.status(200).json({
      code: 200,
      status: "Success!",
      message: "Category Updated successfully",
      data: { results: response },
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

// Category Details
export const getCategoryById = async (req, res) => {
  try {
    const response = await Categories.findById(req.params.CategoryId);
    if (!response) {
      res
        .status(404)
        .json({ code: 404, status: "Category not found", data: {} });
      return;
    }
    res.status(200).json({
      code: 200,
      status: "Success!",
      message: "Category Details successfully",
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

// Delete Category
export const deleteCategoryById = async (req, res) => {
  try {
    const response = await Categories.findByIdAndDelete(req.params.CategoryId);
    if (!response) {
      // console.log(res);
      res
        .status(404)
        .json({ code: 404, status: "Category not found", data: {} });
      return;
    }
    cache.del("category_data");

    res.status(200).json({
      code: 200,
      status: "Success!",
      message: "Category Deleted successfully",
      data: { results: response },
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      code: 500,
      status: "An error occurred! Check server logs for more info.",
      data: {},
    });
  }
};

// Categories Order Update
export const CategoryOrderUpdate = async (req, res) => {
  try {
    const { order_json } = req.body;

    if (!Array.isArray(order_json) || order_json.length === 0) {
      return res.status(400).json({
        code: 400,
        status: "Bad Request",
        message: "order_json array is required",
      });
    }

    // Update all categories in parallel
    const updatePromises = order_json.map((item) =>
      Categories.findByIdAndUpdate(
        item.CategoryId,
        { order: item.order },
        { new: true },
      ),
    );

    await Promise.all(updatePromises);

    // ✅ Get all categories after update
    const allCategories = await Categories.find().sort({ order: 1 });

    res.status(200).json({
      code: 200,
      status: "Success!",
      message: "Categories order updated successfully",
      data: { results: allCategories },
    });
  } catch (error) {
    console.error("CategoryOrderUpdate Error:", error);
    res.status(500).json({
      code: 500,
      status: "An error occurred! Check server logs for more info.",
      data: {},
    });
  }
};
