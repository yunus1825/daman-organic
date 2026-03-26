import Order from "../models/Orders.model.js";
import User from "../models/user.model.js";
import Address from "../models/Address.model.js";
import Cart from "../models/Cart.model.js";
import Products from "../models/Products.model.js";
import StoreManagement from "../models/StoreManagement.model.js";
import DeliveryCharges from "../models/DeliveryCharges.model.js";
import axios from "axios";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Explicit Gmail SMTP host
  port: 587, // Use SSL (port 465)
  secure: false,
  auth: {
    user: "organicdaman@gmail.com",
    pass: process.env.pass,
  },
  pool: true,
  maxConnections: 3,
  maxMessages: 50,
});

// Contact Us Mail
export const contactUsMail = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        code: 400,
        status: "Bad Request",
        message: "Name, Email, Subject, and Message are required.",
      });
    }

    // Mail Options
    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: "online@damanorganic.com",
      subject: `📩 Contact Us: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h3>New Contact Us Message</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong><br/>${message}</p>
        </div>
      `,
    };

    // Send Email
    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      code: 200,
      status: "Success!",
      message: "Your message has been sent successfully.",
    });
  } catch (error) {
    console.error("Contact Us Email Error:", error);
    return res.status(500).json({
      code: 500,
      status: "Error",
      message: "Failed to send your message. Please try again later.",
      data: { error: error.message },
    });
  }
};

// Create Order
export const createOrder = async (req, res) => {
  try {
    const {
      product_json,
      discount_price,
      totalPrice,
      addressId,
      userId,
      ...rest
    } = req.body;
    const orderedDate = new Date();

    // Validate product_json
    if (!Array.isArray(product_json) || product_json.length === 0) {
      return res.status(400).json({
        code: 400,
        status: "Error!",
        message: "Invalid product_json. It must be a non-empty array.",
        data: {},
      });
    }

    // Validate addressId
    if (!addressId) {
      return res.status(400).json({
        code: 400,
        status: "Error!",
        message: "Address ID is required!",
        data: {},
      });
    }

    // Validate userId
    if (!userId) {
      return res.status(400).json({
        code: 400,
        status: "Error!",
        message: "User ID is required!",
        data: {},
      });
    }

    // Fetch address
    const addressData = await Address.findById(addressId);
    if (!addressData) {
      return res.status(404).json({
        code: 404,
        status: "Error!",
        message: "No address found with the provided Address ID.",
        data: {},
      });
    }

    // Fetch user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        code: 404,
        status: "User not found!",
        data: {},
      });
    }

    // Create order
    const newOrder = new Order({
      ...rest,
      userId,
      product_json,
      discount_price,
      totalPrice,
      orderedDate,
      addressId,
      customer_address: {
        userId: addressData.userId,
        addressType: addressData.addressType,
        flatNo: addressData.flatNo,
        phoneNo: addressData.phoneNo,
        address: addressData.address,
        city: addressData.city,
        appartment_name: addressData.appartment_name,
        street: addressData.street,
        area: addressData.area,
        landmark: addressData.landmark,
        pincode: addressData.pincode,
        mapLink: addressData.mapLink,
        latitude: addressData.latitude,
        longitude: addressData.longitude,
      },
    });

    const savedOrder = await newOrder.save();

    // Clear cart items for the ordered products
    try {
      const productIds = product_json.map((item) => item.productId);
      await Cart.deleteMany({
        userId: userId,
        productId: { $in: productIds },
      });

      console.log(
        `Cleared cart for user ${userId} for products: ${productIds.join(", ")}`,
      );
    } catch (cartError) {
      console.error("Error clearing cart items:", cartError);
      // Don't fail the order if cart clearing fails, just log it
    }

    return res.status(200).json({
      code: 200,
      status: "Success!",
      message: "Order created successfully and cart cleared",
      data: { results: savedOrder },
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
// Create Order With userid no product_json
// export const createOrderwithcart = async (req, res) => {
//     try {
//         const { discount_price, totalPrice, addressId,paymentType, userId, ...rest } = req.body;
//         const orderedDate = new Date();

//         if (!addressId) {
//             return res.status(400).json({
//                 code: 400,
//                 status: "Error!",
//                 message: "Address ID is required!",
//                 data: {},
//             });
//         }

//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({
//                 code: 404,
//                 status: "User not found!",
//                 data: {},
//             });
//         }

//         const addressData = await Address.findById(addressId);
//         if (!addressData) {
//             return res.status(404).json({
//                 code: 404,
//                 status: "Error!",
//                 message: "No address found with the provided Address ID.",
//                 data: {},
//             });
//         }

//         const cartItems = await Cart.find({ userId });
//         if (!cartItems || cartItems.length === 0) {
//             return res.status(400).json({
//                 code: 400,
//                 status: "Error!",
//                 message: "Cart is empty. Cannot create order.",
//                 data: {},
//             });
//         }

//         const product_json = await Promise.all(cartItems.map(async (item) => {
//             try {
//                 const product = await Products.findById(item.productId);
//                 if (!product) return null;

//                 let selling_price = 0;

//                 if (item.variantId) {
//                     const variant = product.variants.find(
//                         (v) => String(v._id) === String(item.variantId)
//                     );
//                     if (!variant) return null;

//                     selling_price = variant.selling_Price || 0;
//                 } else {
//                     selling_price = product.selling_price || product.price || 0;
//                 }

//                 const quantity = item.quantity || 1;

//                 return {
//                     productId: product._id,
//                     prd_Name: product.prd_Name,
//                     categoryId: product.categoryId,
//                     categoryName: product.categoryName,
//                     variantId: item.variantId || null,
//                     productPrice: selling_price,
//                     quantity: quantity
//                 };
//             } catch (err) {
//                 console.error("Error processing cart item:", err);
//                 return null;
//             }
//         }));

//         const filteredProducts = product_json.filter(item => item !== null);

//         if (filteredProducts.length === 0) {
//             return res.status(400).json({
//                 code: 400,
//                 status: "Error!",
//                 message: "No valid products found in cart.",
//                 data: {},
//             });
//         }

//         const newOrder = new Order({
//             ...rest,
//             userId,
//             product_json: filteredProducts,
//             discount_price,
//             totalPrice,
//             orderedDate,
//             addressId,
//             paymentType,
//             customer_address: {
//                 userId: addressData.userId,
//                 addressType: addressData.addressType,
//                 flatNo: addressData.flatNo,
//                 phoneNo: addressData.phoneNo,
//                 address: addressData.address,
//                 city: addressData.city,
//                 appartment_name: addressData.appartment_name,
//                 street: addressData.street,
//                 area: addressData.area,
//                 landmark: addressData.landmark,
//                 pincode: addressData.pincode,
//                 mapLink: addressData.mapLink,
//                 latitude: addressData.latitude,
//                 longitude: addressData.longitude,
//             },
//         });

//         const savedOrder = await newOrder.save();

//        // ✅ Delete cart only if paymentType is COD
//        if (paymentType === "COD") {
//         await Cart.deleteMany({ userId });
//     }

//         return res.status(200).json({
//             code: 200,
//             status: "Success!",
//             message: "Order created successfully",
//             data: { results: savedOrder },
//         });

//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             code: 500,
//             status: "Error!",
//             message: "An error occurred. Check logs for more details.",
//             data: { error: error.message },
//         });
//     }
// };
export const createOrderwithcart = async (req, res) => {
  try {
    const {
      discount_price,
      totalPrice,
      addressId,
      paymentType,
      userId,
      ...rest
    } = req.body;
    const orderedDate = new Date();

    // Basic validations
    if (!addressId) {
      return res.status(400).json({
        code: 400,
        status: "Error!",
        message: "Address ID is required!",
        data: {},
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        code: 404,
        status: "User not found!",
        data: {},
      });
    }

    const addressData = await Address.findById(addressId);
    if (!addressData) {
      return res.status(404).json({
        code: 404,
        status: "Error!",
        message: "No address found with the provided Address ID.",
        data: {},
      });
    }

    const cartItems = await Cart.find({ userId });
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({
        code: 400,
        status: "Error!",
        message: "Cart is empty. Cannot create order.",
        data: {},
      });
    }

    // Check all products for availability
    let hasUnavailableProducts = false;

    for (const item of cartItems) {
      const product = await Products.findById(item.productId);
      if (!product) {
        hasUnavailableProducts = true;
        break;
      }

      // 🧠 If item has a variant, check variant first — it overrides product status
      if (item.variantId) {
        const variant = product.variants.find(
          (v) => String(v._id) === String(item.variantId),
        );

        if (!variant) {
          hasUnavailableProducts = true;
          break;
        }

        // ✅ Variant unavailable checks
        if (
          variant.hide === true ||
          variant.status === false ||
          variant.inStock === false
        ) {
          hasUnavailableProducts = true;
          break;
        }

        // Variant is valid, skip product-level checks
        continue;
      }

      // 🧩 If no variant, check product availability
      if (product.hide === true || product.status === false) {
        hasUnavailableProducts = true;
        break;
      }
    }

    // If any unavailable products found
    if (hasUnavailableProducts) {
      return res.status(400).json({
        code: 400,
        status: "Failed!",
        message: "Some products in your cart are unavailable",
        data: {},
      });
    }

    // Process only if all products are available
    const product_json = [];
    const productDetailsForEmail = []; // For email display only

    for (const item of cartItems) {
      const product = await Products.findById(item.productId);

      let selling_price = 0;
      let weight = "";
      let productQuantity = "";
      let productType = "unit";

      if (item.variantId) {
        const variant = product.variants.find(
          (v) => String(v._id) === String(item.variantId),
        );
        selling_price = variant.selling_Price || 0;
        weight = variant.weight || "";

        // Get quantity and Type from variant if available
        productQuantity = variant.quantity || "";
        productType = variant.Type || product?.Type || "unit";
      } else {
        selling_price = product.selling_price || product.price || 0;
        weight = product.weight || "";

        // Get quantity and Type from product
        productQuantity = product.quantity || "";
        productType = product.Type || "unit";
      }

      // For order insertion
      product_json.push({
        productId: product._id,
        prd_Name: product.prd_Name,
        categoryId: product.categoryId,
        categoryName: product.categoryName,
        variantId: item.variantId || null,
        productPrice: selling_price,
        quantity: item.quantity || 1,
        weight: weight,
      });

      // For email display only (with quantity and Type from product/variant model)
      productDetailsForEmail.push({
        prd_Name: product.prd_Name,
        quantity: item.quantity || 1,
        productQuantity: productQuantity,
        Type: productType,
        productPrice: selling_price,
        total: selling_price * (item.quantity || 1),
        hasVariant: !!item.variantId,
      });
    }

    const formatDate = (date) =>
      date ? date.toISOString().split("T")[0] : null;

    if (product_json.length === 0) {
      return res.status(400).json({
        code: 400,
        status: "Error!",
        message: "No valid products found in cart.",
        data: {},
      });
    }

    const newOrder = new Order({
      ...rest,
      userId,
      product_json: product_json,
      discount_price,
      totalPrice,
      orderedDate,
      addressId,
      paymentType,
      customer_address: {
        userId: addressData.userId,
        addressType: addressData.addressType,
        customer_name: addressData.customer_name,
        email: addressData.email,
        flatNo: addressData.flatNo,
        phoneNo: addressData.phoneNo,
        address: addressData.address,
        city: addressData.city,
        appartment_name: addressData.appartment_name,
        street: addressData.street,
        area: addressData.area,
        landmark: addressData.landmark,
        pincode: addressData.pincode,
        mapLink: addressData.mapLink,
        latitude: addressData.latitude,
        longitude: addressData.longitude,
      },
    });

    const savedOrder = await newOrder.save();

    // Prepare response with user details
    const responseData = {
      code: 200,
      status: "Success!",
      message: "Order created successfully",
      data: {
        results: {
          ...savedOrder._doc,
          userName: user.name,
          userEmail: user.email,
        },
      },
    };

    // Send emails only for COD orders
    if (paymentType === "COD") {
      try {
        await Cart.deleteMany({ userId });

        const formattedDate = orderedDate.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

        // const customerAddress = `${addressData.customer_name || ""} ${addressData.email || ""} ${addressData.flatNo || ""} ${addressData.appartment_name || ""} ${addressData.street || ""} ${addressData.area || ""} ${addressData.landmark || ""} ${addressData.city || ""} ${addressData.pincode || ""}, ${addressData.address || ""}`;
        const customerAddress = `
                    ${
                      addressData.customer_name
                        ? `<strong>Name:</strong> ${addressData.customer_name}<br/>`
                        : ""
                    }
                    ${
                      addressData.email
                        ? `<strong>Email:</strong> ${addressData.email}<br/>`
                        : ""
                    }
                    ${
                      addressData.flatNo
                        ? `<strong>Flat No:</strong>${addressData.flatNo},<br/>`
                        : ""
                    }
                    ${
                      addressData.appartment_name
                        ? `<strong>Appartment Name:</strong>${addressData.appartment_name},<br/>`
                        : ""
                    }
                    ${
                      addressData.street
                        ? `<strong>Street:</strong>${addressData.street},<br/>`
                        : ""
                    }
                    ${
                      addressData.area
                        ? `<strong>Area:</strong>${addressData.area},<br/>`
                        : ""
                    }
                    ${
                      addressData.landmark
                        ? `<strong>Landmark:</strong> ${addressData.landmark}<br/>`
                        : ""
                    }
                    ${
                      addressData.city
                        ? `<strong>City:</strong>${addressData.city}, `
                        : ""
                    }
                    ${
                      addressData.pincode
                        ? `<strong>Pincode:</strong>${addressData.pincode}<br/>`
                        : ""
                    }
                    ${
                      addressData.address
                        ? `<strong>Address:</strong>${addressData.address}`
                        : ""
                    }
                    `.trim();
        // Enhanced order summary with quantity and Type from product/variant model
        const orderSummary = productDetailsForEmail
          .map((item) => {
            const quantityText =
              item.productQuantity && item.Type
                ? `${item.quantity} unit x ${item.prd_Name} - ${item.productQuantity} ${item.Type}`
                : `${item.quantity} unit x ${item.prd_Name}`;

            return `${quantityText} = ₹${item.total}`;
          })
          .join("<br/><br/>");

        // Email to Admin
        const adminMailOptions = {
          from: "organicdaman@gmail.com",
          to: "online@damanorganic.com",
          subject: `New COD Order Received - Order ID: ${savedOrder.ordId}`,
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <p style="font-weight: bold; font-size: 16px;">Order Date & Time</p>
                <p>${formattedDate}</p>
                <p>Order ID: ${savedOrder.ordId}</p>
                <br/>

                ${
                  savedOrder.scheduleDate && savedOrder.scheduleTime
                    ? `
                <p style="font-weight: bold; font-size: 16px; color: green;">Scheduled Order</p>
                <p><strong>Scheduled Delivery Date:</strong> ${formatDate(
                  savedOrder.scheduleDate,
                )}</p>
                <p><strong>Scheduled Delivery Time:</strong> ${
                  savedOrder.scheduleTime
                }</p>
                <br/>`
                    : ""
                }

                <p style="font-weight: bold; font-size: 16px;">Customer Details</p>
                <p><strong>Name:</strong> ${user?.name || "N/A"}</p>
                <p><strong>Phone:</strong> ${addressData.phoneNo}</p>
                <p><strong>Email:</strong> ${user?.email || "N/A"}</p>
                <p "><strong>Address:</strong><br/> ${customerAddress}</p>
                <br/>
                
                <p style="font-weight: bold; font-size: 16px;">Order Details</p>
                <p>${orderSummary}</p>
                <br/>
                
                <p><strong>Delivery Charges:</strong> ₹${
                  savedOrder.deliveryCharge || 0
                }</p>
                <br/>
                
                <p style="font-weight: bold; font-size: 18px; color: #2c5aa0;">Total: ₹${
                  savedOrder.totalPrice
                } | Cash on Delivery</p>
                <p>Check online payment status in store dashboard.</p>
            </div>
          `,
        };

        await transporter.sendMail(adminMailOptions);
        console.log("Admin email sent");

        // Email to Customer
        if (addressData?.email) {
          const customerMailOptions = {
            from: "organicdaman@gmail.com",
            to: addressData.email,
            subject: "Your Order has been Placed Successfully",
            html: `
              <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                  <p style="font-weight: bold; font-size: 18px;">Order Confirmation</p>
                  <p>Thank you for your order! Your order has been placed successfully.</p>
                  <br/>
                  
                  <p style="font-weight: bold;">Order ID: ${
                    savedOrder.ordId
                  }</p>
                  <p style="font-weight: bold;">Order Date: ${formattedDate}</p>
                  <br/>
                  
                  <p style="font-weight: bold; font-size: 16px;">Delivery Address</p>
                  <p style="color: #0066cc;">${customerAddress}</p>
                  <br/>
                  
                  <p style="font-weight: bold; font-size: 16px;">Order Summary</p>
                  <p>${orderSummary}</p>
                  <br/>
                  
                  <p>Delivery Charges: ₹${savedOrder.deliveryCharge || 0}</p>
                  <p style="font-weight: bold;">Total Amount: ₹${
                    savedOrder.totalPrice
                  }</p>
                  <p>Payment Method: Cash on Delivery</p>
                  <br/>
                  
                  <p>We'll notify you when your order ships. Thank you for shopping with us!</p>
              </div>
            `,
          };
          await transporter.sendMail(customerMailOptions);
          console.log("Customer email sent");
        } else {
          console.log(
            "Customer email not available. Skipping email to customer.",
          );
        }
      } catch (emailError) {
        console.error("Error sending order confirmation emails:", emailError);
      }
    }

    return res.status(200).json(responseData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      status: "Error!",
      message:
        error.message || "An error occurred. Check logs for more details.",
      data: {},
    });
  }
};

// Order List for Admin Dashboard
export const getAllOrders = async (req, res) => {
  try {
    // Initialize an empty query object for fetching orders
    let query = {
      $or: [
        { paymentType: { $ne: "Online" } }, // Show all non-Online payments
        {
          paymentType: "Online",
          payment_status: "PAID", // Only show PAID Online payments
        },
      ],
    };

    const orders = await Order.find(query).sort({ orderedDate: -1 });

    const userIds = orders.map((order) => order.userId);

    const users = await User.find({ _id: { $in: userIds } });

    const userMap = users.reduce((acc, user) => {
      acc[user._id] = user.name;
      return acc;
    }, {});

    const formattedOrders = orders.map((order) => {
      const userName = userMap[order.userId] || "Unknown";
      const totalProductCount = order.product_json.length;

      // Calculate the SubTotal and include RefundAmount
      const subTotal =
        order.refundamount != null
          ? order.totalPrice - order.refundamount
          : order.totalPrice;

      const formattedOrder = {
        _id: order._id,
        ordId: order.ordId,
        ordStatus: order.ordStatus,
        TotalPrice: order.totalPrice,
        RefundAmount: order.refundamount, // Include refund amount
        SubTotal: subTotal, // Updated SubTotal calculation
        TotalProductsCount: totalProductCount,
        PaymentType: order.paymentType,
        scheduleDate: order.scheduleDate
          ? order.scheduleDate.toISOString().split("T")[0]
          : null,
        scheduleTime: order?.scheduleTime,
        OrderDate: order.createdAt
          ? order.createdAt.toISOString().split("T")[0]
          : null,
        UserName: order.customer_address.customer_name,
        ...(order.paymentType === "Online" && {
          payment_status: order.payment_status || "Pending",
        }),
      };

      return formattedOrder;
    });

    // Send a successful response with the formatted orders
    res.status(200).json({
      code: 200,
      status: "Success!",
      message: "Order Data fetched successfully",
      data: { length: formattedOrders.length, results: formattedOrders },
    });
  } catch (error) {
    // Log the error and send an error response
    console.error(error);
    res.status(500).json({
      code: 500,
      status: "An error occurred! Check server logs for more info.",
      data: {},
    });
  }
};

// Order Details Api
export const OrderDetails = async (req, res) => {
  try {
    const response = await Order.findById(req.params.OrderId);

    if (!response) {
      return res.status(404).json({
        code: 404,
        status: "Failed!",
        message: "Order not found.",
        data: {},
      });
    }

    const user = await User.findById(response.userId);

    let orderedProducts = [];

    for (const product of response.product_json) {
      const productDetail = await Products.findById(product.productId);

      if (productDetail) {
        // Get variant data if variantId exists
        let variantData = null;
        if (product.variantId) {
          variantData = productDetail.variants.find(
            (v) => v._id.toString() === product.variantId.toString(),
          );
        }

        // Get user review and rating
        const userReview = productDetail.reviews?.find(
          (r) => r.ordId?.toString() === response.ordId?.toString(),
        );

        const userRating = productDetail.ratings?.find(
          (r) => r.ordId?.toString() === response.ordId?.toString(),
        );

        const detailObj = productDetail.toObject();
        // Remove unwanted fields
        delete detailObj.ratings;
        delete detailObj.reviews;
        delete detailObj.variants; // Remove variants array from productDetail

        // Prepare product data with variant information
        const productData = {
          productPrice: product.productPrice,
          productId: product.productId,
          variantId: product.variantId || null,
          quantity: product.quantity || 1,
          isAccepted: product.isAccepted,
          prd_Name: product.prd_Name,
          categoryId: product.categoryId,
          categoryName: product.categoryName,
          productDetail: detailObj, // Now without variants array
          selectedVariant: variantData || null,
          userReview: userReview?.review || null,
          userRating: userRating?.rating || null,
        };

        orderedProducts.push(productData);
      }
    }

    // Calculate the sub_total - use totalPrice if refundamount is null/undefined
    const subTotal =
      response.refundamount != null
        ? response.totalPrice - response.refundamount
        : response.totalPrice;

    const orderDetails = {
      _id: response._id,
      userId: response.userId,
      UserName: response.customer_address.customer_name || "Unknown",
      customer_address: response.customer_address,
      product_json: orderedProducts,
      paymentType: response.paymentType,
      TotalPrice: response.totalPrice,
      RefundAmount: response.refundamount,
      SubTotal: subTotal, // Updated SubTotal field
      coupon_code: response.coupon_code,
      discount_price: response.discount_price,
      ordId: response.ordId,
      orderedDate: response.orderedDate,
      acceptedDate: response.acceptedDate,
      assignDate: response.assignDate,
      deliveredDate: response.deliveredDate,
      scheduleDate: response.scheduleDate
        ? response.scheduleDate.toISOString().split("T")[0]
        : null,
      scheduleTime: response?.scheduleTime,
      deliveryCharge: response?.deliveryCharge,
      ordmessage: response?.ordmessage,
      cancel_reason: response?.cancel_reason,
      ordStatus: response?.ordStatus,
    };

    res.status(200).json({
      code: 200,
      status: "Success!",
      message: "Order Details fetched successfully",
      data: orderDetails,
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

// User Order List
export const getAllOrdersbyUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    // ✅ Find orders with correct payment logic
    const userOrders = await Order.find({
      userId: userId,
      $or: [
        { paymentType: { $ne: "Online" } },
        { paymentType: "Online", payment_status: "PAID" },
      ],
    }).sort({ orderedDate: -1 });

    // Get all product IDs from all orders
    const productIds = userOrders.flatMap((order) =>
      order.product_json.map((product) => product.productId),
    );

    // Find all products
    const allProducts = await Products.find({ _id: { $in: productIds } });

    // Get user details
    const user = await User.findById(userId);

    // Process each order
    const formattedOrders = userOrders.map((order) => {
      const formattedProducts = order.product_json.map((orderProduct) => {
        const fullProduct = allProducts.find(
          (p) => p._id.toString() === orderProduct.productId.toString(),
        );

        if (!fullProduct) {
          return {
            ...(orderProduct.toObject?.() || orderProduct),
            productDetail: null,
            selectedVariant: null,
            userReview: null,
            userRating: null,
          };
        }

        let selectedVariant = null;
        if (orderProduct.variantId) {
          selectedVariant = fullProduct.variants.find(
            (v) => v._id.toString() === orderProduct.variantId.toString(),
          );
        }

        const userReview = fullProduct.reviews?.find(
          (r) =>
            r.userId.toString() === userId.toString() &&
            r.ordId?.toString() === order._id.toString(),
        );

        const userRating = fullProduct.ratings?.find(
          (r) =>
            r.userId.toString() === userId.toString() &&
            r.ordId?.toString() === order._id.toString(),
        );

        const productDetail = { ...fullProduct.toObject() };
        delete productDetail.variants;
        delete productDetail.ratings;
        delete productDetail.reviews;

        return {
          productPrice: orderProduct.productPrice,
          productId: orderProduct.productId,
          variantId: orderProduct.variantId || null,
          quantity: orderProduct.quantity,
          prd_Name: orderProduct.prd_Name || fullProduct.prd_Name,
          categoryId: orderProduct.categoryId || fullProduct.categoryId,
          categoryName: orderProduct.categoryName || fullProduct.categoryName,
          productDetail: productDetail,
          selectedVariant: selectedVariant,
          userReview: userReview?.review || null,
          userRating: userRating?.rating || null,
        };
      });

      const refundAmount = order.refundamount || 0;
      const subTotal = (order.totalPrice || 0) - refundAmount;

      return {
        _id: order._id,
        userId: order.userId,
        UserName: user?.name || "Unknown",
        customer_address: order.customer_address,
        product_json: formattedProducts,
        paymentType: order.paymentType,
        TotalPrice: order.totalPrice,
        refundAmount: refundAmount,
        subTotal: subTotal,
        discount_price: order.discount_price,
        ordId: order.ordId,
        orderedDate: order.orderedDate,
        ordStatus: order.ordStatus,
      };
    });

    return res.status(200).json({
      code: 200,
      status: "Success!",
      message: "User Orders List Fetched Successfully",
      data: {
        length: formattedOrders.length,
        results: formattedOrders,
      },
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

// Payment status Update
export const OrderPaymentStatusSuccess = async (req, res) => {
  try {
    const { ordId } = req.params;
    const { paymentId } = req.body;

    // Find the order
    const order = await Order.findOne({ ordId: ordId });
    if (!order) {
      return res.status(404).json({
        code: 404,
        status: "Order not found! Please select a valid order.",
        data: {},
      });
    }

    // Get user details
    const user = await User.findById(order.userId).select("name email");
    if (!user) {
      console.error(`User not found for order ${ordId}`);
      return res.status(404).json({
        code: 404,
        status: "User not found!",
        data: {},
      });
    }

    // Update payment status and save payment ID
    order.payment_status = "PAID";
    if (paymentId) {
      order.paymentId = paymentId;
    }
    const updatedOrder = await order.save();

    // Get address details
    const addressData = await Address.findById(order.addressId);

    // Delete user's cart
    await Cart.deleteMany({ userId: order.userId });

    const formattedDate = order.orderedDate.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const customerAddress = addressData
      ? `
            ${
              addressData.customer_name
                ? `<strong>Name:</strong> ${addressData.customer_name}<br/>`
                : ""
            }
            ${
              addressData.email
                ? `<strong>Email:</strong> ${addressData.email}<br/>`
                : ""
            }
            ${
              addressData.flatNo
                ? `<strong>Flat No:</strong> ${addressData.flatNo},<br/>`
                : ""
            }
            ${
              addressData.appartment_name
                ? `<strong>Appartment Name:</strong> ${addressData.appartment_name},<br/>`
                : ""
            }
            ${
              addressData.street
                ? `<strong>Street:</strong> ${addressData.street},<br/>`
                : ""
            }
            ${
              addressData.area
                ? `<strong>Area:</strong> ${addressData.area},<br/>`
                : ""
            }
            ${
              addressData.landmark
                ? `<strong>Landmark:</strong> ${addressData.landmark}<br/>`
                : ""
            }
            ${
              addressData.city
                ? `<strong>City:</strong> ${addressData.city}, `
                : ""
            }
            ${
              addressData.pincode
                ? `<strong>Pincode:</strong> ${addressData.pincode}<br/>`
                : ""
            }
            ${
              addressData.address
                ? `<strong>Address:</strong> ${addressData.address}`
                : ""
            }
            `.trim()
      : "Address not available";

    // Fetch product details for email display with variant support
    const productDetailsForEmail = await Promise.all(
      order.product_json.map(async (item) => {
        const product = await Products.findById(item.productId);

        let productQuantity = "";
        let productType = "unit";

        // Check if variant exists and get quantity/Type from variant
        if (item.variantId && product && product.variants) {
          const variant = product.variants.find(
            (v) => String(v._id) === String(item.variantId),
          );
          if (variant) {
            productQuantity = variant.quantity || "";
            productType = variant.Type || product?.Type || "unit";
          } else {
            // Variant not found, fallback to product
            productQuantity = product?.quantity || "";
            productType = product?.Type || "unit";
          }
        } else {
          // No variant, get from product
          productQuantity = product?.quantity || "";
          productType = product?.Type || "unit";
        }

        return {
          prd_Name: product?.prd_Name || item.prd_Name,
          quantity: item.quantity || 1,
          productQuantity: productQuantity,
          Type: productType,
          productPrice: item.productPrice || 0,
          total: (item.productPrice || 0) * (item.quantity || 1),
          hasVariant: !!item.variantId,
        };
      }),
    );

    // Send confirmation emails
    try {
      // Enhanced order summary with quantity and Type from product/variant model
      const productSummaryHtml = productDetailsForEmail
        .map((item) => {
          const quantityText =
            item.productQuantity && item.Type
              ? `${item.quantity} unit x ${item.prd_Name} - ${item.productQuantity} ${item.Type}`
              : `${item.quantity} unit x ${item.prd_Name}`;

          return `${quantityText} = ₹${item.total}`;
        })
        .join("<br/><br/>");

      const customerMailOptions = {
        from: "organicdaman@gmail.com",
        to: addressData.email,
        subject: "Your Order has been Placed Successfully",
        html: `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                        <p style="font-weight: bold; font-size: 18px;">Payment Confirmation</p>
                        <p>Thank you for your order! Your order is now being processed.</p><br/>
                        <p><strong>Order ID:</strong> ${order.ordId}</p>
                        <p><strong>Order Date:</strong> ${formattedDate}</p>
                        <p><strong>Payment ID:</strong> ${
                          paymentId || "N/A"
                        }</p><br/>
                        <p><strong>Delivery Address:</strong><br/><span style="color: #0066cc;">${customerAddress}</span></p><br/>
                        <p><strong>Order Summary:</strong></p>
                        <p>${productSummaryHtml}</p><br/>
                        <p>Delivery Charges: ₹${order.deliveryCharge || 0}</p>
                        <p><strong>Total Amount:</strong> ₹${
                          order.totalPrice
                        }</p>
                        <p>Payment Method: Online Payment (Successfully processed)</p><br/>
                        <p>We'll notify you when your order ships. Thank you for shopping with us!</p>
                    </div>
                `,
      };

      const adminMailOptions = {
        from: "organicdaman@gmail.com",
        to: "online@damanorganic.com",
        subject: `New Paid Order - Order ID: ${order.ordId}`,
        html: `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                        <p><strong>Order Date:</strong> ${formattedDate}</p>
                        <p><strong>Order ID:</strong> ${order.ordId}</p>
                        ${
                          order.scheduleDate && order.scheduleTime
                            ? `
                            <p style="color: green;"><strong>Scheduled Delivery Date:</strong> ${order.scheduleDate}</p>
                            <p><strong>Scheduled Delivery Time:</strong> ${order.scheduleTime}</p>`
                            : ""
                        }
                        <br/>
                        <p><strong>Customer Details:</strong></p>
                        <p><strong>Name:</strong>${user.name}</p>
                        <p><strong>Phone:</strong>${
                          addressData?.phoneNo || "Phone not available"
                        }</p>
                        <p><strong>Email:</strong>${user.email}</p>
                        <p><strong>Address:</strong><br/>${customerAddress}</p><br/>
                        <p><strong>Order Details:</strong></p>
                        <p>${productSummaryHtml}</p><br/>
                        <p>Delivery Charges: ₹${
                          order.deliveryCharge || 0
                        }</p><br/>
                        <p><strong>Total:</strong> ₹${
                          order.totalPrice
                        } | Online Payment</p>
                        <p><strong>Payment ID:</strong> ${
                          paymentId || "N/A"
                        }</p>
                    </div>
                `,
      };

      await transporter.sendMail(customerMailOptions);
      await transporter.sendMail(adminMailOptions);
      console.log("Emails sent successfully");
    } catch (emailError) {
      console.error("Error sending confirmation emails:", emailError);
    }

    // Return response
    return res.status(200).json({
      code: 200,
      status: "Success!",
      message: "Payment Status Updated & Cart Cleared",
      data: {
        order: {
          ...updatedOrder.toObject(),
          userName: user.name,
          userEmail: user.email,
          paymentId: paymentId,
        },
      },
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

// Payment Failed Status Update
export const OrderPaymentStatusFailed = async (req, res) => {
  try {
    const { ordId } = req.params;

    // Find the order by ID
    const order = await Order.findOne({ ordId: ordId });
    if (!order) {
      return res.status(404).json({
        code: 404,
        status: "Order not found! Please select a valid order.",
        data: {},
      });
    }
    // Update order details
    order.payment_status = "FAILED";
    // Save the updated order
    const updatedOrder = await order.save();
    // Return success response
    return res.status(200).json({
      code: 200,
      status: "Success!",
      message: "Payment Status Updated",
      data: { order: updatedOrder },
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
// Get Distance And store Id
// function getDistanceInKm(lat1, lon1, lat2, lon2) {
//     const R = 6371; // Radius of the earth in km
//     const dLat = (lat2 - lat1) * Math.PI / 180;
//     const dLon = (lon2 - lon1) * Math.PI / 180;
//     const a =
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
//       Math.sin(dLon / 2) * Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return R * c;
//   }

// export const getDistanceById = async (req, res) => {
//   try {
//     const address = await Address.findById(req.params.AddressId);
//     if (!address) {
//       return res.status(404).json({
//         code: 404,
//         status: "Address not found",
//         data: {},
//       });
//     }

//     const { pincode, latitude: addrLat, longitude: addrLong } = address;
//     if (!pincode || addrLat == null || addrLong == null) {
//       return res.status(400).json({
//         code: 400,
//         status: "Invalid address location data",
//         data: {},
//       });
//     }

//     const stores = await StoreManagement.find({
//       "pincodes.pincode": pincode,
//     });

//     if (!stores.length) {
//       return res.status(404).json({
//         code: 404,
//         status: "No store found serving this pincode",
//         data: {},
//       });
//     }

//     // ✅ Calculate distances to each store
//     const storesWithDistance = stores
//       .map((store) => {
//         const { latitude: storeLat, longitude: storeLong } = store;
//         if (storeLat != null && storeLong != null) {
//           const distance = getDistanceInKm(addrLat, addrLong, storeLat, storeLong);
//           return {
//             storeId: store._id,
//             StoreName: store.store_name,
//             distanceInKm: parseFloat(distance.toFixed(2)),
//           };
//         }
//         return null;
//       })
//       .filter(Boolean);

//     // ✅ Get the nearest store
//     const nearestStore = storesWithDistance.sort((a, b) => a.distanceInKm - b.distanceInKm)[0];

//     if (!nearestStore) {
//       return res.status(404).json({
//         code: 404,
//         status: "No store with valid location found",
//         data: {},
//       });
//     }

//     // ✅ Fetch delivery charges list
//     const allCharges = await DeliveryCharges.find({ status: true }).sort({ kms: 1 });

//     // ✅ Find the delivery charge that applies to the distance
//     let deliveryCharge = 0;
//     for (let charge of allCharges) {
//       if (nearestStore.distanceInKm <= charge.kms) {
//         deliveryCharge = charge.charges;
//         break;
//       }
//     }

//     // ✅ If no matching tier, use the highest available
//     if (deliveryCharge === 0 && allCharges.length > 0) {
//       deliveryCharge = allCharges[allCharges.length - 1].charges;
//     }

//     // ✅ Format distance
//     const distanceStr =
//       nearestStore.distanceInKm < 1
//         ? `${Math.round(nearestStore.distanceInKm * 1000)} meters`
//         : `${nearestStore.distanceInKm} km`;

//     // ✅ Final response
//     return res.status(200).json({
//       code: 200,
//       status: "Success!",
//       data: {
//         addressId: address._id,
//         storeId: nearestStore.storeId,
//         StoreName: nearestStore.StoreName,
//         distance: distanceStr,
//         deliveryCharge: deliveryCharge,
//       },
//     });
//   } catch (error) {
//     console.error("Error:", error);
//     return res.status(500).json({
//       code: 500,
//       status: "Internal Server Error",
//       data: { error: error.message },
//     });
//   }
// };

// Replace this with your actual pincode distance calculation
// function getApproxDistanceByPincode(addressPincode, storePincode) {
//     // This should be implemented with your business logic
//     // For example: lookup from a pincode-distance database or API
//     // For now, returning a fixed 5km distance as example
//     console.log(`[Pincode Distance] Calculating between address: ${addressPincode} and store: ${storePincode}`);
//     return 5;
// }

// export const getDistanceById = async (req, res) => {
//   try {
//     const address = await Address.findById(req.params.AddressId);
//     if (!address) {
//       return res.status(404).json({
//         code: 404,
//         status: "Address not found",
//         data: {},
//       });
//     }

//     const { pincode: addressPincode, latitude: addrLat, longitude: addrLong } = address;
//     console.log(`[Address] Pincode: ${addressPincode}, Coordinates: ${addrLat}, ${addrLong}`);
//     if (!addressPincode) {
//       return res.status(400).json({
//         code: 400,
//         status: "Address pincode is required",
//         data: {},
//       });
//     }

//     // Find stores that serve this pincode (checking in pincodes array)
//     const stores = await StoreManagement.find({
//       "pincodes.pincode": addressPincode.toString() // Ensure string comparison
//     });

//     if (!stores.length) {
//       return res.status(404).json({
//         code: 404,
//         status: "No store found serving this pincode",
//         data: {},
//       });
//     }

//     // Calculate distances to each store
//     const storesWithDistance = stores.map((store) => {
//         const { latitude: storeLat, longitude: storeLong, pincode: storePincode } = store;

//         // Verify store has a pincode
//         if (!storePincode) return null;

//         let distance;
//         let calculationMethod;

//         // Case 1: Both address and store have coordinates - use precise calculation
//         if (addrLat != null && addrLong != null && storeLat != null && storeLong != null) {
//           distance = getDistanceInKm(addrLat, addrLong, storeLat, storeLong);
//           calculationMethod = "coordinates";
//         }
//         // Case 2: Missing coordinates - fall back to pincode approximation
//         else {
//           distance = getApproxDistanceByPincode(addressPincode, storePincode);
//           calculationMethod = "pincodes";
//         }

//         return {
//           storeId: store._id,
//           StoreName: store.store_name,
//           distanceInKm: parseFloat(distance.toFixed(2)),
//           calculationMethod
//         };
//       }).filter(Boolean);

//     // Get the nearest store
//     const nearestStore = storesWithDistance.sort((a, b) => a.distanceInKm - b.distanceInKm)[0];

//     if (!nearestStore) {
//       return res.status(404).json({
//         code: 404,
//         status: "No store with valid location found",
//         data: {},
//       });
//     }

//     // Fetch delivery charges
//     const allCharges = await DeliveryCharges.find({ status: true }).sort({ kms: 1 });

//     let deliveryCharge = 0;
//     for (let charge of allCharges) {
//       if (nearestStore.distanceInKm <= charge.kms) {
//         deliveryCharge = charge.charges;
//         break;
//       }
//     }

//     // If no matching tier, use the highest available
//     if (deliveryCharge === 0 && allCharges.length > 0) {
//       deliveryCharge = allCharges[allCharges.length - 1].charges;
//     }

//     // Format distance
//     const distanceStr =
//       nearestStore.distanceInKm < 1
//         ? `${Math.round(nearestStore.distanceInKm * 1000)} meters`
//         : `${nearestStore.distanceInKm} km`;

//     // Final response
//     return res.status(200).json({
//       code: 200,
//       status: "Success!",
//       data: {
//         addressId: address._id,
//         storeId: nearestStore.storeId,
//         StoreName: nearestStore.StoreName,
//         distance: distanceStr,
//         deliveryCharge: deliveryCharge,
//         calculationMethod: nearestStore.calculationMethod // Optional
//       },
//     });
//   } catch (error) {
//     console.error("Error:", error);
//     return res.status(500).json({
//       code: 500,
//       status: "Internal Server Error",
//       data: { error: error.message },
//     });
//   }
// };

// Cache setup
const pincodeCache = new Map();
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 1 week cache

// Google Maps API Config
const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const GEOCODE_URL = "https://maps.googleapis.com/maps/api/geocode/json";

// Earth radius in km
const EARTH_RADIUS_KM = 6371;

/**
 * Get coordinates from Google Maps API with caching
 */
async function getPincodeCoordinates(pincode, country = "IN") {
  // Check cache first
  const cached = pincodeCache.get(pincode);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.coords;
  }

  try {
    const response = await axios.get(GEOCODE_URL, {
      params: {
        address: pincode,
        components: `country:${country}|postal_code:${pincode}`,
        key: GOOGLE_API_KEY,
      },
      timeout: 5000, // 5 second timeout
    });

    if (response.data.status === "OK" && response.data.results.length > 0) {
      const { lat, lng } = response.data.results[0].geometry.location;
      const coords = { lat, lng };

      // Update cache
      pincodeCache.set(pincode, {
        coords,
        timestamp: Date.now(),
      });

      return coords;
    }
  } catch (error) {
    console.error(`Geocoding failed for pincode ${pincode}:`, error.message);
  }

  return null;
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

/**
 * Main distance calculation product
 */
export const getDistanceById = async (req, res) => {
  try {
    // 1. Get address details
    const address = await Address.findById(req.params.AddressId);
    if (!address) {
      return res.status(404).json({
        code: 404,
        status: "Failed",
        message: "Address not found",
        data: {},
      });
    }

    const {
      pincode: addressPincode,
      latitude: addrLat,
      longitude: addrLong,
    } = address;
    console.log(`Processing address pincode: ${addressPincode}`);

    // 2. Find serving stores
    const stores = await StoreManagement.find({
      "pincodes.pincode": addressPincode.toString(),
    });

    if (!stores.length) {
      return res.status(400).json({
        code: 400,
        status: "Failed",
        message: "No store found serving this pincode",
        data: {},
      });
    }

    // 3. Calculate distances
    const distanceResults = await Promise.all(
      stores.map(async (store) => {
        try {
          const {
            _id,
            store_name,
            pincode: storePincode,
            latitude: storeLat,
            longitude: storeLong,
          } = store;

          // Use existing coordinates if available
          if (addrLat && addrLong && storeLat && storeLong) {
            const distance = calculateDistance(
              addrLat,
              addrLong,
              storeLat,
              storeLong,
            );
            return {
              storeId: _id,
              storeName: store_name,
              distance,
              method: "coordinates",
            };
          }

          // Fallback to pincode geocoding
          const [addressCoords, storeCoords] = await Promise.all([
            addrLat && addrLong
              ? { lat: addrLat, lng: addrLong }
              : getPincodeCoordinates(addressPincode),
            storeLat && storeLong
              ? { lat: storeLat, lng: storeLong }
              : getPincodeCoordinates(storePincode),
          ]);

          if (!addressCoords || !storeCoords) {
            console.warn(
              `Missing coordinates for ${addressPincode} or ${storePincode}`,
            );
            return null;
          }

          const distance = calculateDistance(
            addressCoords.lat,
            addressCoords.lng,
            storeCoords.lat,
            storeCoords.lng,
          );

          return {
            storeId: _id,
            storeName: store_name,
            distance,
            method: "geocoded",
          };
        } catch (error) {
          console.error(`Error processing store ${store._id}:`, error);
          return null;
        }
      }),
    );

    // 4. Find nearest store
    const validResults = distanceResults.filter(Boolean);
    if (!validResults.length) {
      return res.status(404).json({
        code: 404,
        status: "No valid distance calculations available",
        data: {},
      });
    }

    validResults.sort((a, b) => a.distance - b.distance);
    const nearestStore = validResults[0];

    // 5. Calculate delivery charge
    const deliveryCharges = await DeliveryCharges.find({ status: true }).sort({
      kms: 1,
    });
    let charge = deliveryCharges[deliveryCharges.length - 1].charges; // Default to max charge

    for (const tier of deliveryCharges) {
      if (nearestStore.distance <= tier.kms) {
        charge = tier.charges;
        break;
      }
    }

    // 6. Format response
    const response = {
      code: 200,
      status: "Success!",
      data: {
        addressId: address._id,
        storeId: nearestStore.storeId,
        StoreName: nearestStore.storeName,
        distance:
          nearestStore.distance < 1
            ? `${Math.round(nearestStore.distance * 1000)} meters`
            : `${nearestStore.distance.toFixed(2)} km`,
        deliveryCharge: charge,
        calculationMethod: nearestStore.method,
      },
    };

    console.log("Successful distance calculation:", response.data);
    return res.status(200).json(response);
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({
      code: 500,
      status: "Internal Server Error",
      data: { error: error.message },
    });
  }
};

// Order Notification
export const getOrderNotification = async (req, res) => {
  try {
    let query = {
      ordStatus: { $in: ["Open", "Accepted", "Assigned"] },
      $or: [
        { paymentType: { $ne: "Online" } },
        {
          paymentType: "Online",
          payment_status: "PAID",
        },
      ],
    };

    const orders = await Order.find(query).sort({ orderedDate: -1 });

    const userIds = orders.map((order) => order.userId);
    const users = await User.find({ _id: { $in: userIds } });

    const userMap = users.reduce((acc, user) => {
      acc[user._id] = user.name;
      return acc;
    }, {});

    const today = new Date().toISOString().split("T")[0];

    const formattedOrders = orders
      .map((order) => {
        const userName = userMap[order.userId] || "Unknown";
        const totalproductCount = order.product_json.length;
        const formatDate = (date) =>
          date ? date.toISOString().split("T")[0] : null;

        const scheduleDateFormatted = formatDate(order?.scheduleDate);

        const refundAmount = order.refundamount || 0;
        const subTotal = (order.totalPrice || 0) - refundAmount;

        return {
          _id: order._id,
          ordId: order.ordId,
          ordStatus: order.ordStatus,
          TotalPrice: order.totalPrice,
          refundAmount: refundAmount,
          subTotal: subTotal,
          ordmessage: order?.ordmessage,
          scheduleDate: scheduleDateFormatted,
          scheduleTime: order?.scheduleTime,
          TotalProductsCount: totalproductCount,
          PaymentType: order.paymentType,
          OrderDate: order.createdAt
            ? order.createdAt.toISOString().split("T")[0]
            : null,
          UserName: userName,
          ...(order.paymentType === "Online" && {
            payment_status: order.payment_status || "Pending",
          }),
        };
      })
      .filter((order) => {
        // Only include if scheduleDate is null or equal to today
        return !order.scheduleDate || order.scheduleDate === today;
      });

    const sortedOrders = formattedOrders.sort((a, b) => {
      const priority = { Accepted: 1, Assigned: 2, Open: 3 };
      return (priority[a.ordStatus] || 4) - (priority[b.ordStatus] || 4);
    });

    res.status(200).json({
      code: 200,
      status: "Success!",
      message: "Order Data Fetched successfully",
      data: { length: sortedOrders.length, results: sortedOrders },
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

// Accepted Order
export const AcceptOrder = async (req, res) => {
  try {
    const { OrderId } = req.params;
    const { accepted_by, ordmessage, acceptedProductIds } = req.body;

    // Validation
    if (
      !Array.isArray(acceptedProductIds) ||
      acceptedProductIds.some((item) => !item.productId)
    ) {
      return res.status(400).json({
        code: 400,
        status: "Bad Request",
        message:
          "acceptedProductIds must be an array of objects with productId",
        data: {},
      });
    }

    // Find order
    const order = await Order.findById(OrderId);
    if (!order) {
      return res.status(404).json({
        code: 404,
        status: "Order not found",
        data: {},
      });
    }

    if (order.ordStatus !== "Open") {
      return res.status(400).json({
        code: 400,
        status: "Failure",
        message: "Order already processed",
        data: {},
      });
    }

    // Calculate original total amount
    const originalTotal = order.product_json.reduce(
      (total, product) => total + product.quantity * product.productPrice,
      0,
    );

    // Process accepted products and calculate new total
    const acceptedProductIdStrings = acceptedProductIds.map((item) =>
      item.productId.toString(),
    );
    let newTotal = 0;

    order.product_json = order.product_json.map((product) => {
      const isAccepted = acceptedProductIdStrings.includes(
        product.productId.toString(),
      );
      if (isAccepted) {
        newTotal += product.quantity * product.productPrice;
      }
      return {
        ...product.toObject(),
        isAccepted,
      };
    });

    // Calculate refund amount
    const refundAmount = originalTotal - newTotal;

    // Update order
    order.accepted_by = accepted_by;
    order.ordmessage = ordmessage;
    order.ordStatus = "Accepted";
    order.acceptedDate = new Date();
    // order.totalPrice = newTotal;
    order.refundamount = refundAmount;

    const updatedOrder = await order.save();

    // Send email notification
    await sendCustomerNotification(updatedOrder, ordmessage);

    return res.status(200).json({
      code: 200,
      status: "Success",
      data: formatOrderResponse(updatedOrder),
    });
  } catch (error) {
    console.error("Order acceptance error:", error);
    return res.status(500).json({
      code: 500,
      status: "Server Error",
      message: error.message,
      data: {},
    });
  }
};

const sendCustomerNotification = async (order, message) => {
  try {
    const user = await User.findById(order.userId).select("name email");
    if (!user?.email) return;

    const formatDate = (date) =>
      date ? new Date(date).toLocaleDateString("en-IN") : "N/A";
    const formatCurrency = (amount) =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(amount);

    const mailOptions = {
      from: "organicdaman@gmail.com",
      to: user.email,
      subject: `Order #${order.ordId} Accepted`,
      html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: #f5f5f5; padding: 20px; text-align: center;">
                        <h2 style="color: #2e7d32;">Order Accepted</h2>
                    </div>
                    
                    <div style="padding: 20px;">
                        <p>Dear ${user.name || "Customer"},</p>
                        <p>Your order <strong>#${
                          order.ordId
                        }</strong> has been accepted.</p>
                        
                        <h3 style="color: #2e7d32;">Order Summary</h3>
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                            <tr>
                                <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Order Date</td>
                                <td style="padding: 8px; border-bottom: 1px solid #eee;">${formatDate(
                                  order.orderedDate,
                                )}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Total Amount</td>
                                <td style="padding: 8px; border-bottom: 1px solid #eee;">${formatCurrency(
                                  order.totalPrice,
                                )}</td>
                            </tr>
                            ${
                              order.refundamount > 0
                                ? `
                            <tr>
                                <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Refund Amount</td>
                                <td style="padding: 8px; border-bottom: 1px solid #eee; color: #d32f2f;">
                                    ${formatCurrency(order.refundamount)}
                                </td>
                            </tr>
                            `
                                : ""
                            }
                        </table>
                        
                        <h3 style="color: #2e7d32; margin-top: 20px;">Products</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="background: #f5f5f5;">
                                    <th style="padding: 10px; text-align: left;">Product</th>
                                    <th style="padding: 10px; text-align: right;">Qty</th>
                                    <th style="padding: 10px; text-align: right;">Price</th>
                                    <th style="padding: 10px; text-align: right;">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${order.product_json
                                  .map(
                                    (p) => `
                                <tr>
                                    <td style="padding: 10px; border-bottom: 1px solid #eee;">${
                                      p.prd_Name
                                    }</td>
                                    <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${
                                      p.quantity
                                    }</td>
                                    <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(
                                      p.productPrice,
                                    )}</td>
                                    <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; color: ${
                                      p.isAccepted ? "#2e7d32" : "#d32f2f"
                                    };">
                                        ${
                                          p.isAccepted
                                            ? "Accepted"
                                            : "Not Available"
                                        }
                                    </td>
                                </tr>
                                `,
                                  )
                                  .join("")}
                            </tbody>
                        </table>
                        
                        ${
                          message
                            ? `<p style="margin-top: 20px;"><strong>Note:</strong> ${message}</p>`
                            : ""
                        }
                        
                        <p style="margin-top: 30px;">Thank you for your order!</p>
                        <p>Best regards,<br>Daman Organic Team</p>
                    </div>
                </div>
            `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Customer notification sent to ${user.email}`);
  } catch (error) {
    console.error("Failed to send customer email:", error);
  }
};

const formatOrderResponse = (order) => {
  return {
    ordId: order.ordId,
    status: order.ordStatus,
    acceptedDate: order.acceptedDate,
    totalPrice: order.totalPrice,
    refundAmount: order.refundAmount,
    products: order.product_json.map((p) => ({
      productId: p.productId,
      name: p.prd_Name,
      quantity: p.quantity,
      price: p.productPrice,
      isAccepted: p.isAccepted,
      lineTotal: p.quantity * p.productPrice,
    })),
    message: order.ordmessage || null,
  };
};
// Assigned Order
export const AssignOrder = async (req, res) => {
  try {
    const { OrderId } = req.params;
    const { assign_by } = req.body;

    // Find the order by ID
    const order = await Order.findById(OrderId);
    if (!order) {
      return res.status(404).json({
        code: 404,
        status: "Order not found! Please select a valid order.",
        data: {},
      });
    }

    // Get user data
    const user = await User.findById(order.userId).select("name email");

    // Update order details
    order.assign_by = assign_by;
    order.ordStatus = "Assigned";
    order.assignDate = new Date();

    // Save the updated order
    const updatedOrder = await order.save();

    // Send email notification
    if (user?.email) {
      await sendAssignmentEmail(updatedOrder, user);
    }

    // Return success response
    return res.status(200).json({
      code: 200,
      status: "Success!",
      message: "Order Assigned successfully",
      data: formatAssignmentResponse(updatedOrder, user),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      status: "Server Error",
      message: error.message,
      data: {},
    });
  }
};

// Email sending function
const sendAssignmentEmail = async (order, user) => {
  try {
    const formatDate = (date) =>
      date ? new Date(date).toLocaleDateString("en-IN") : "N/A";
    const formatCurrency = (amount) =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(amount);

    const mailOptions = {
      from: "organicdaman@gmail.com",
      to: user.email,
      subject: `Order #${order.ordId} Assigned for Delivery`,
      html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: #f5f5f5; padding: 20px; text-align: center;">
                        <h2 style="color: #2e7d32;">Order Assigned</h2>
                    </div>
                    
                    <div style="padding: 20px;">
                        <p>Dear ${user.name || "Customer"},</p>
                        <p>Your order <strong>#${
                          order.ordId
                        }</strong> has been assigned to our delivery partner.</p>
                        
                        <h3 style="color: #2e7d32;">Order Summary</h3>
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                            <tr>
                                <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Order Date</td>
                                <td style="padding: 8px; border-bottom: 1px solid #eee;">${formatDate(
                                  order.orderedDate,
                                )}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Accepted Date</td>
                                <td style="padding: 8px; border-bottom: 1px solid #eee;">${formatDate(
                                  order.acceptedDate,
                                )}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Assigned Date</td>
                                <td style="padding: 8px; border-bottom: 1px solid #eee;">${formatDate(
                                  order.assignDate,
                                )}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Total Amount</td>
                                <td style="padding: 8px; border-bottom: 1px solid #eee;">${formatCurrency(
                                  order.totalPrice,
                                )}</td>
                            </tr>
                            ${
                              order.refundamount > 0
                                ? `
                            <tr>
                                <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Refund Amount</td>
                                <td style="padding: 8px; border-bottom: 1px solid #eee; color: #d32f2f;">
                                    ${formatCurrency(order.refundamount)}
                                </td>
                            </tr>
                            `
                                : ""
                            }
                        </table>
                        
                        <h3 style="color: #2e7d32; margin-top: 20px;">Products</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="background: #f5f5f5;">
                                    <th style="padding: 10px; text-align: left;">Product</th>
                                    <th style="padding: 10px; text-align: right;">Qty</th>
                                    <th style="padding: 10px; text-align: right;">Price</th>
                                    <th style="padding: 10px; text-align: right;">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${order.product_json
                                  .map(
                                    (p) => `
                                <tr>
                                    <td style="padding: 10px; border-bottom: 1px solid #eee;">${
                                      p.prd_Name
                                    }</td>
                                    <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${
                                      p.quantity
                                    }</td>
                                    <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(
                                      p.productPrice,
                                    )}</td>
                                    <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; color: ${
                                      p.isAccepted ? "#2e7d32" : "#d32f2f"
                                    };">
                                        ${
                                          p.isAccepted
                                            ? "Accepted"
                                            : "Not Available"
                                        }
                                    </td>
                                </tr>
                                `,
                                  )
                                  .join("")}
                            </tbody>
                        </table>
                        
                        <p style="margin-top: 30px;">Your order will be delivered shortly. Thank you for shopping with us!</p>
                        <p>Best regards,<br>Daman Organic Team</p>
                    </div>
                </div>
            `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Assignment email sent to ${user.email}`);
  } catch (error) {
    console.error("Failed to send assignment email:", error);
  }
};

// Response formatting
const formatAssignmentResponse = (order, user) => {
  const formatDate = (date) => (date ? date.toISOString().split("T")[0] : null);

  return {
    _id: order._id,
    ordId: order.ordId,
    ordStatus: order.ordStatus,
    totalPrice: order.totalPrice,
    refundAmount: order.refundAmount || 0,
    paymentType: order.paymentType,
    orderDate: formatDate(order.orderedDate),
    acceptedDate: formatDate(order.acceptedDate),
    assignDate: formatDate(order.assignDate),
    userName: user?.name,
    products: order.product_json.map((p) => ({
      productId: p.productId,
      name: p.prd_Name,
      quantity: p.quantity,
      price: p.productPrice,
      isAccepted: p.isAccepted,
    })),
  };
};
// Deliver order
export const DeliveredOrder = async (req, res) => {
  try {
    const { OrderId } = req.params;
    const { deliver_by } = req.body;

    // Find the order by ID
    const order = await Order.findById(OrderId);
    if (!order) {
      return res.status(404).json({
        code: 404,
        status: "Order not found",
        data: {},
      });
    }

    // Get user data
    const user = await User.findById(order.userId).select("name email");

    // Update order details
    order.deliver_by = deliver_by;
    order.ordStatus = "Delivered";
    order.deliveredDate = new Date();

    // Save the updated order
    const updatedOrder = await order.save();

    // Send email notification
    if (user?.email) {
      await sendDeliveryEmail(updatedOrder, user);
    }

    // Return success response
    return res.status(200).json({
      code: 200,
      status: "Success",
      message: "Order delivered successfully",
      data: formatDeliveryResponse(updatedOrder, user),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      status: "Server Error",
      message: error.message,
      data: {},
    });
  }
};

// Email sending function
const sendDeliveryEmail = async (order, user) => {
  try {
    const formatDate = (date) =>
      date ? new Date(date).toLocaleDateString("en-IN") : "N/A";
    const formatCurrency = (amount) =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(amount);

    const mailOptions = {
      from: "organicdaman@gmail.com",
      to: user.email,
      subject: `Order #${order.ordId} Delivered Successfully`,
      html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: #f5f5f5; padding: 20px; text-align: center;">
                        <h2 style="color: #2e7d32;">Order Delivered</h2>
                    </div>
                    
                    <div style="padding: 20px;">
                        <p>Dear ${user.name || "Customer"},</p>
                        <p>We're happy to inform you that your order <strong>#${
                          order.ordId
                        }</strong> has been delivered successfully.</p>
                        
                        <h3 style="color: #2e7d32;">Delivery Summary</h3>
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                            <tr>
                                <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Order Date</td>
                                <td style="padding: 8px; border-bottom: 1px solid #eee;">${formatDate(
                                  order.orderedDate,
                                )}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Delivered Date</td>
                                <td style="padding: 8px; border-bottom: 1px solid #eee;">${formatDate(
                                  order.deliveredDate,
                                )}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Total Amount</td>
                                <td style="padding: 8px; border-bottom: 1px solid #eee;">${formatCurrency(
                                  order.totalPrice,
                                )}</td>
                            </tr>
                            ${
                              order.refundamount > 0
                                ? `
                            <tr>
                                <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Refund Amount</td>
                                <td style="padding: 8px; border-bottom: 1px solid #eee; color: #d32f2f;">
                                    ${formatCurrency(order.refundamount)}
                                </td>
                            </tr>
                            `
                                : ""
                            }
                        </table>
                        
                        <h3 style="color: #2e7d32; margin-top: 20px;">Delivered Products</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="background: #f5f5f5;">
                                    <th style="padding: 10px; text-align: left;">Product</th>
                                    <th style="padding: 10px; text-align: right;">Qty</th>
                                    <th style="padding: 10px; text-align: right;">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${order.product_json
                                  .filter((p) => p.isAccepted)
                                  .map(
                                    (p) => `
                                <tr>
                                    <td style="padding: 10px; border-bottom: 1px solid #eee;">${
                                      p.prd_Name
                                    }</td>
                                    <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${
                                      p.quantity
                                    }</td>
                                    <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(
                                      p.productPrice,
                                    )}</td>
                                </tr>
                                `,
                                  )
                                  .join("")}
                            </tbody>
                        </table>
                        
                        <div style="margin-top: 30px; padding: 15px; background-color: #f8f9fa; border-radius: 4px;">
                            <p>Thank you for shopping with <strong>Daman Organic</strong>!</p>
                            <p>We hope you're satisfied with your purchase. If you have any questions, please reply to this email.</p>
                        </div>
                        
                        <p style="margin-top: 20px;">Best regards,<br>Daman Organic Team</p>
                    </div>
                </div>
            `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Delivery email sent to ${user.email}`);
  } catch (error) {
    console.error("Failed to send delivery email:", error);
  }
};

// Response formatting
const formatDeliveryResponse = (order, user) => {
  const formatDate = (date) => (date ? date.toISOString().split("T")[0] : null);

  return {
    ordId: order.ordId,
    status: order.ordStatus,
    deliveredDate: formatDate(order.deliveredDate),
    totalPrice: order.totalPrice,
    refundAmount: order.refundAmount || 0,
    paymentType: order.paymentType,
    products: order.product_json
      .filter((p) => p.isAccepted)
      .map((p) => ({
        productId: p.productId,
        name: p.prd_Name,
        quantity: p.quantity,
        price: p.productPrice,
        lineTotal: p.quantity * p.productPrice,
      })),
    customer: {
      name: user?.name,
      email: user?.email,
    },
  };
};
// Cancel Order
export const cancelOrder = async (req, res) => {
  try {
    const { OrderId } = req.params;
    const { cancel_by, cancel_reason } = req.body;

    // Find the order by ID
    const order = await Order.findById(OrderId);
    if (!order) {
      return res.status(404).json({
        code: 404,
        status: "Order not found! Please select a valid order.",
        data: {},
      });
    }

    // Get user info
    const user = await User.findById(order.userId).select("name email");
    if (!user) {
      console.log(`User not found for order ${OrderId}`);
    }

    // Update order for cancellation
    order.cancel_by = cancel_by;
    order.cancel_reason = cancel_reason;
    order.ordStatus = "Cancelled";
    order.cancelDate = new Date();

    // Save updated order
    const updatedOrder = await order.save();

    const formatDate = (date) =>
      date ? date.toISOString().split("T")[0] : null;

    // Send cancellation email if user exists
    if (user?.email) {
      const cancelOrderMailOptions = {
        from: "organicdaman@gmail.com",
        to: user.email,
        subject: `Your Order #${order.ordId} Has Been Cancelled`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <p style="font-weight: bold; font-size: 18px;">Order Cancelled</p>
            <p>Dear ${user.name || "Customer"},</p>
            <p>We regret to inform you that your order has been cancelled.</p>
            <br/>
            <p><strong>Order ID:</strong> ${order.ordId}</p>
            <p><strong>Order Date:</strong> ${formatDate(order.orderedDate)}</p>
            <p><strong>Cancelled Date:</strong> ${formatDate(
              order.cancelDate,
            )}</p>
            <p><strong>Total Amount:</strong> Rs. ${order.totalPrice}</p>
            <p><strong>Payment Method:</strong> ${order.paymentType}</p>
            ${
              cancel_reason
                ? `<p><strong>Reason:</strong> ${cancel_reason}</p>`
                : ""
            }
            <br/>
            <p>If you have any questions, feel free to reach out to our support.</p>
            <br/>
            <p>Best regards,<br/>Daman Organic Team</p>
          </div>
        `,
      };

      try {
        await transporter.sendMail(cancelOrderMailOptions);
        console.log(`Cancellation email sent to ${user.email}`);
      } catch (emailError) {
        console.error("Error sending cancellation email:", emailError);
      }
    }

    // Return response
    return res.status(200).json({
      code: 200,
      status: "Success!",
      message: "Order cancelled successfully",
      data: {
        _id: order._id,
        ordId: order.ordId,
        ordStatus: order.ordStatus,
        TotalPrice: order.totalPrice,
        TotalProductsCount: order.product_json.length,
        PaymentType: order.paymentType,
        OrderDate: formatDate(order.orderedDate),
        cancelDate: formatDate(order.cancelDate),
        cancelReason: order.cancel_reason,
        UserName: user?.name,
      },
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
