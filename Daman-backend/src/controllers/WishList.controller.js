import WishList from "../models/WishList.model.js";
import Products from "../models/Products.model.js";


export const addToWishList = async (req, res) => {
  try {
    const { productId, userId } = req.body;

    // ✅ Check if userId is provided
    if (!userId) {
      return res.status(400).json({
        code: 400,
        status: "Failed",
        message: "User ID is required.",
      });
    }

    // ✅ Check if productId is provided
    if (!productId) {
      return res.status(400).json({
        code: 400,
        status: "Failed",
        message: "Product ID is required.",
      });
    }

    // ✅ 1. Check if the product already exists in the user's wishlist
    const existingWishlistItem = await WishList.findOne({ userId, productId });

    if (existingWishlistItem) {
      return res.status(400).json({
        code: 400,
        status: "Failed",
        message: "Product already exists in the wishlist.",
      });
    }

    // ✅ 2. Add product to wishlist
    const newWishlistItem = new WishList({
      userId,
      productId,
    });

    // ✅ 3. Save the new wishlist item
    const response = await newWishlistItem.save();

    // ✅ 4. Fetch the product details
    const productDetails = await Products.findById(productId)
      .select("-createdAt -updatedAt -__v");

    if (!productDetails) {
      return res.status(404).json({
        code: 404,
        status: "Failed",
        message: "Product not found.",
      });
    }

    // ✅ 5. Construct the combined response
    const combinedResponse = {
      ...response.toObject(),
      product: productDetails.toObject(),
    };

    // ✅ 6. Send the final response
    res.status(200).json({
      code: 200,
      status: "Success!",
      message: "Product added to wishlist.",
      data: combinedResponse,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      code: 500,
      status: "An error occurred! Check server logs for more info.",
      data: { error: error.message },
    });
  }
};


export const getAllWishList = async (req, res) => {
  try {
    const userId = req.params.userId;

    const wishListItems = await WishList.find({ userId: userId });

    if (!wishListItems || wishListItems.length === 0) {
      return res.status(200).json({
        code: 200,
        status: "Success!",
        data: { length: 0, results: []},
      });
    }

    const productIds = wishListItems.map(item => item.productId);
    const products = await Products.find({ _id: { $in: productIds } })
      .select('-Variants  -createdAt -updatedAt');

    const combinedData = wishListItems.map(wishListItem => {
      const product = products.find(product => product._id.equals(wishListItem.productId));
      if (!product) {
        return null;
      }
      return {
        ...wishListItem.toObject(), 
        product: product.toObject() 
      };
    }).filter(item => item !== null); 

    res.status(200).json({
      code: 200,
      status: "Success!",
      data: { length: combinedData.length, results: combinedData },
    });
  } catch (error) {
    console.log(error); // Log the error to view details
    res.status(500).json({
      code: 500,
      status: "An error occurred! Check server logs for more info.",
      data: {},
    });
  }
};


export const removeFromWishList = async (req, res) => {
  try {
    const { productId, userId } = req.body;

    // ✅ Check if the product exists in the wishlist
    const existingWishlistItem = await WishList.findOne({ userId, productId });

    if (!existingWishlistItem) {
      return res.status(404).json({
        code: 404,
        status:"failed",
        message: "Product not found in wishlist."

      });
    }

    // ✅ Remove the product from the wishlist
    await WishList.findOneAndRemove({ userId, productId });

    // ✅ Respond with only userId and productId
    res.status(200).json({
      code: 200,
      status: "Success!",
      message: "Product removed from wishlist.",
      data: {
        userId,
        productId,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      code: 500,
      status: "An error occurred! Check server logs for more info.",
      data: { error: error.message },
    });
  }
};
