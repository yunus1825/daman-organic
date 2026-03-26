import Home from "../models/Home.model.js";
import Products from "../models/Products.model.js";

// Create Home page section
export const createHomes = async (req, res) => {
  try {
    const { ...rest } = req.body;

    const newHomes = new Home({
      ...rest,
    });

    const response = await newHomes.save();

    res.status(200).json({
      code: 200,
      status: "Success!",
      message: "Home Added Successfully",
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

// Update Home Page Section
export const updateHomesById = async (req, res) => {
  try {
    const { ...rest } = req.body;

    const updateData = {
      ...rest,
    };

    const response = await Home.findByIdAndUpdate(
      req.params.HomeId,
      updateData,
      { new: true }
    );

    if (!response) {
      return res.status(404).json({
        code: 404,
        status: "Failed",
        message: "Data not found",
        data: {},
      });
    }

    res.status(200).json({
      code: 200,
      status: "Success!",
      message: "Home Updated Successfully",
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

// Detail Home Section
export const getHomeById = async (req, res) => {
  try {
    const response = await Home.findById(req.params.HomeId);
    if (!response) {
      return res.status(404).json({
        code: 404,
        status: "Failed",
        message: "Data not found",
        data: {},
      });
    }
    res.status(200).json({
      code: 200,
      status: "Success!",
      message: "Home Details successfully retrieved",
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

// Delete Home section
export const deleteHomeById = async (req, res) => {
  try {
    const response = await Home.findByIdAndDelete(req.params.HomeId);
    if (!response) {
      return res.status(404).json({
        code: 404,
        status: "Failed",
        message: "Data not found",
        data: {},
      });
    }

    res.status(200).json({
      code: 200,
      status: "Success!",
      message: "Home Deleted successfully",
      data: { results: response },
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: "An error occurred! Check server logs for more info.",
      data: {},
    });
  }
};

// Get Home Sections with product details
export const getAllHomeSections = async (req, res) => {
  try {
    const sections = await Home.find().lean();

    if (!sections.length) {
      return res.status(200).json({
        code: 200,
        status: "Success!",
        message: "No sections found.",
        data: { length: 0, results: [] },
      });
    }

    const sectionsWithProducts = await Promise.all(
      sections.map(async (section) => {
        const productIds = section.products.map((p) => p.productId);
        const products = await Products.find({
          _id: { $in: productIds },
          hide: false,
        })
          .select("-reviews -ratings -createdAt -updatedAt -__v")
          .lean();

        return {
          _id: section._id,
          section_name: section.section_name,
          products,
          createdAt: section.createdAt,
          updatedAt: section.updatedAt,
        };
      })
    );

    res.status(200).json({
      code: 200,
      status: "Success!",
      message: "Sections List successfully retrieved.",
      data: {
        length: sectionsWithProducts.length,
        results: sectionsWithProducts,
      },
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
