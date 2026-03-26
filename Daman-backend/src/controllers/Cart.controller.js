import Cart from "../models/Cart.model.js";
import Products from "../models/Products.model.js";
import User from "../models/user.model.js";
// Add & Update Cart
export const createCart = async (req, res) => {
  try {
    const { productId, quantity, variantId } = req.body;
    const { userId } = req.params;

    // Step 1: Validate user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Step 2: Update or create cart item
    let cartItem = await Cart.findOne({ userId, productId });

    if (cartItem) {
      cartItem.quantity = quantity;
      if (variantId) cartItem.variantId = variantId;
      await cartItem.save();
    } else {
      cartItem = new Cart({ userId, productId, quantity, variantId });
      await cartItem.save();
    }

    // Step 3: Get product and variant info
    const product = await Products.findById(productId).lean();
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const variantData = product.variants?.find(
      (v) => v._id.toString() === variantId,
    );

    // Step 4: Calculate pricing
    const itemCostSellingPrice = variantData
      ? quantity * variantData.selling_Price
      : quantity * product.selling_price;

    const itemCostDisplayPrice = quantity * product.display_price;

    // Step 5: Remove variants array from product
    const { variants, ...productWithoutVariants } = product;

    // Step 6: Construct final response
    const response = {
      ...cartItem.toObject(),
      product: {
        ...productWithoutVariants,
        // itemCostSellingPrice,
        // itemCostDisplayPrice,
        variantData: variantData || null,
      },
    };
    return res.status(200).json({
      code: 200,
      status: "Success!",
      message: "Product Added in Cart",
      data: response,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User Cart Items
export const getAllCart = async (req, res) => {
  try {
    const userId = req.params.userId;

    // ✅ Fetch all cart items for the user
    const cartItems = await Cart.find({ userId: userId });

    if (!cartItems || cartItems.length === 0) {
      return res.status(200).json({
        code: 200,
        status: "Success!",
        data: { length: 0, results: [], totalCost: 0 },
      });
    }

    // ✅ Get product IDs from the cart items
    const productIds = cartItems.map((item) => item.productId);

    // ✅ Fetch product details for those IDs
    const products = await Products.find({
      _id: { $in: productIds },
      hide: false,
    }).select("-createdAt -updatedAt");

    // ✅ Initialize cost variables
    let DisplayPricetotalCost = 0;
    let SellingPricetotalCost = 0;
    let DiscountPrice = 0;

    // ✅ Combine cart items with their respective product and variant data
    const combinedData = cartItems
      .map((cartItem) => {
        const product = products.find((product) =>
          product._id.equals(cartItem.productId),
        );

        if (!product) return null; // ❌ Skip if product not found

        // ✅ If variantId exists, fetch variant data safely
        let variantData =
          product.variants && product.variants.length > 0
            ? product.variants.find((v) => v._id.equals(cartItem.variantId))
            : null;

        // ✅ Calculate prices
        const itemCostSellingPrice = variantData
          ? cartItem.quantity * variantData.selling_Price
          : cartItem.quantity * product.selling_price;

        const itemCostDisplayPrice = cartItem.quantity * product.display_price;

        // ✅ Add to total cost
        DisplayPricetotalCost += itemCostDisplayPrice;
        SellingPricetotalCost += itemCostSellingPrice;
        DiscountPrice = DisplayPricetotalCost - SellingPricetotalCost;

        // ✅ Remove variants from product object
        const { variants, ...productWithoutVariants } = product.toObject();

        // ✅ Construct the response object
        return {
          ...cartItem.toObject(),
          product: {
            ...productWithoutVariants, // Attach the product details without variants
            itemCostSellingPrice,
            itemCostDisplayPrice,
            variantData: variantData ? variantData.toObject() : null,
          },
        };
      })
      .filter((item) => item !== null); // Remove null values

    // ✅ Send the response
    res.status(200).json({
      code: 200,
      status: "Success!",
      data: {
        length: combinedData.length,
        // DisplayPricetotalCost,
        // SellingPricetotalCost,
        // DiscountPrice,
        results: combinedData,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      code: 500,
      status: "An error occurred! Check server logs for more info.",
      data: { error: error.message },
    });
  }
};

// Delete Cart
export const deleteCartById = async (req, res) => {
  try {
    const response = await Cart.findByIdAndDelete(req.params.cartId);
    if (!response) {
      // console.log(res);
      res.status(404).json({ code: 404, status: "Cart not found", data: {} });
      return;
    }
    res.status(200).json({
      code: 200,
      status: "Success!",
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
// Admin Panel Cart List
export const getAllUserCart = async (req, res) => {
  try {
    // Sort by newest cart first
    const cartItems = await Cart.find().sort({ createdAt: -1 });

    if (!cartItems || cartItems.length === 0) {
      return res.status(200).json({
        code: 200,
        status: "Success!",
        data: { length: 0, results: [] },
      });
    }

    // Extract unique user IDs from the cart items
    const userIds = [...new Set(cartItems.map((item) => item.userId))];

    // Fetch User Information
    // const users = await User.find({ _id: { $in: userIds }, hide: false })
    const users = await User.find({ _id: { $in: userIds } }).select(
      "name email phone",
    );

    // Prepare Combined Data
    const combinedData = [];

    // Create a map to hold user data temporarily
    const userMap = new Map();

    cartItems.forEach((cartItem) => {
      const userId = cartItem.userId.toString();
      const user = users.find((u) => u._id.equals(cartItem.userId));

      if (userMap.has(userId)) {
        // If user already exists in the map, add the product to the list
        userMap.get(userId).products.push({
          _id: cartItem._id,
          productId: cartItem.productId,
          quantity: cartItem.quantity,
        });
      } else {
        // If user does not exist, create a new entry
        userMap.set(userId, {
          userId,
          name: user?.name || null,
          email: user?.email || null,
          phone: user?.phone || null,
          cartCount: 1,
          products: [
            {
              _id: cartItem._id,
              productId: cartItem.productId,
              quantity: cartItem.quantity,
            },
          ],
        });
      }
    });

    // Calculate the correct cart count
    userMap.forEach((value, key) => {
      value.cartCount = value.products.length;
      combinedData.push(value);
    });

    res.status(200).json({
      code: 200,
      status: "Success!",
      data: {
        length: combinedData.length,
        results: combinedData,
      },
    });
  } catch (error) {
    // Log the error to view details
    console.log(error);
    res.status(500).json({
      code: 500,
      status: "An error occurred! Check server logs for more info.",
      data: {},
    });
  }
};
// Admin user cart details
export const getAllCartdetails = async (req, res) => {
  try {
    const userId = req.params.userId;

    // ✅ Fetch all cart items for the user
    const cartItems = await Cart.find({ userId: userId });

    if (!cartItems || cartItems.length === 0) {
      return res.status(200).json({
        code: 200,
        status: "Success!",
        data: { length: 0, results: [], totalCost: 0 },
      });
    }

    // ✅ Get product IDs from the cart items
    const productIds = cartItems.map((item) => item.productId);

    // ✅ Fetch product details for those IDs
    const products = await Products.find({
      _id: { $in: productIds },
      hide: false,
    }).select("-createdAt -updatedAt");

    // ✅ Combine cart items with their respective product and variant data
    const combinedData = cartItems
      .map((cartItem) => {
        const product = products.find((product) =>
          product._id.equals(cartItem.productId),
        );

        if (!product) return null;

        let variantData =
          product.variants && product.variants.length > 0
            ? product.variants.find((v) => v._id.equals(cartItem.variantId))
            : null;

        const itemCostSellingPrice = variantData
          ? cartItem.quantity * variantData.selling_Price
          : cartItem.quantity * product.selling_price;

        const itemCostDisplayPrice = cartItem.quantity * product.display_price;

        const { variants, ...productWithoutVariants } = product.toObject();

        // ✅ Calculate days since added to cart
        const createdAt = new Date(cartItem.createdAt);
        const now = new Date();
        const timeDiff = now - createdAt;
        const daysInCart = Math.floor(timeDiff / (1000 * 60 * 60 * 24)); // convert ms → days

        return {
          ...cartItem.toObject(),
          daysInCart: daysInCart === 0 ? 1 : daysInCart, // Show at least "1 Day"
          product: {
            ...productWithoutVariants,
            itemCostSellingPrice,
            itemCostDisplayPrice,
            variantData: variantData ? variantData.toObject() : null,
          },
        };
      })
      .filter((item) => item !== null);

    // ✅ Send the response
    res.status(200).json({
      code: 200,
      status: "Success!",
      data: {
        length: combinedData.length,
        results: combinedData,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      code: 500,
      status: "An error occurred! Check server logs for more info.",
      data: { error: error.message },
    });
  }
};
