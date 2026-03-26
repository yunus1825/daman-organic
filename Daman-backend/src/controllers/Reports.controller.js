import Order from "../models/Orders.model.js";
import User from "../models/user.model.js";
import Products from "../models/Products.model.js";

// Sats for Total Orders and sales and pending orders
export const getSalesOrderStats = async (req, res) => {
    try {
        // Fetch all orders
        const allOrders = await Order.find();

        // Filter orders by status
        const deliveredOrders = allOrders.filter(order => order.ordStatus === 'Delivered');
        const pendingOrders = allOrders.filter(order => order.ordStatus !== 'Delivered');

        let totalSales = 0;
        let totalRefund = 0;
        let uniqueCustomerIds = new Set();

        // Calculate stats for delivered orders
        for (let order of deliveredOrders) {
            uniqueCustomerIds.add(order.userId.toString());

            // Add to total sales and refund calculation
            const orderSubTotal = order.totalPrice - order.refundamount;  // SubTotal = TotalPrice - RefundAmount
            totalSales += orderSubTotal;  // Add SubTotal to total sales
            totalRefund += order.refundamount;  // Accumulate the total refund amount

            // Optionally, you can also add product-level calculations (if needed)
            for (let product of order.product_json) {
                totalSales += product.productPrice * (product.quantity || 1);  // Add product price to sales
            }
        }

        // Calculate SubTotal
        const subTotal = totalSales - totalRefund;

        res.status(200).json({
            code: 200,
            status: "Success!",
            data: {
                totalSales,
                totalRefund,
                subTotal,  // SubTotal as TotalSales - TotalRefund
                totalOrders: allOrders.length,
                deliveredOrders: deliveredOrders.length,
                pendingOrders: pendingOrders.length,
                totalCustomers: uniqueCustomerIds.size,
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

// Pie Chart Order count based on status 
export const getOrderStatusPieChart = async (req, res) => {
    try {
        const orderStatusBreakdown = await Order.aggregate([
            {
                $group: {
                    _id: "$ordStatus",
                    count: { $sum: 1 }
                }
            }
        ]);

        const result = orderStatusBreakdown.map(item => ({
            name: item._id,
            value: item.count
        }));

        res.status(200).json({
            code: 200,
            status: "Success!",
            message: "Order Data Fatched successfully",
            data: { length: result.length, results: result }
        });
    } catch (error) {
        console.error("getOrderStatusPieChart error:", error);
        res.status(500).json({
            code: 500,
            status: "Server Error!",
            data: []
        });
    }
};
// Monthly sales and Order
export const getSalesByMonthly = async (req, res) => {
    try {
        // Get all completed orders
        const userOrders = await Order.find({ ordStatus: 'Delivered' });

        // Define all months
        const allMonths = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        // Initialize sales object
        const monthlySales = {};
        allMonths.forEach(month => {
            monthlySales[month] = {
                totalSales: 0,
                totalOrderCount: 0,
            };
        });

        // Process each order
        for (let order of userOrders) {
            const orderMonth = new Date(order.createdAt).toLocaleString('default', { month: 'long' });

            if (allMonths.includes(orderMonth)) {
                let orderSales = 0;

                // Sum productPrice from product_json
                for (let product of order.product_json || []) {
                    orderSales += product.productPrice || 0;
                }

                monthlySales[orderMonth].totalSales += orderSales;
                monthlySales[orderMonth].totalOrderCount++;
            }
        }

        // Return result
        res.status(200).json({
            code: 200,
            status: "Success!",
            data: monthlySales,
        });

    } catch (error) {
        console.error("Error in getSalesByMonthly:", error);
        res.status(500).json({
            code: 500,
            status: "An error occurred! Check server logs for more info.",
            data: {},
        });
    }
};
// Customer Wise 
export const getCustomerWiseData = async (req, res) => {
    try {
        // Get all users
        const allUsers = await User.find().select('name email phone');

        // Get all orders grouped by userId
        const ordersByUser = await Order.find().lean();

        const userOrderMap = {};

        ordersByUser.forEach(order => {
            if (!userOrderMap[order.userId]) {
                userOrderMap[order.userId] = [];
            }
            userOrderMap[order.userId].push(order);
        });

        // Build customer report
        const customerReport = allUsers.map(user => {
            const userOrders = userOrderMap[user._id] || [];

            const stats = userOrders.reduce((acc, order) => {
                const orderValue = order.product_json.reduce(
                    (sum, product) => sum + (product.productPrice * (product.quantity || 1)),
                    0
                );

                acc.totalOrders++;
                acc.totalSpent += orderValue;

                if (order.ordStatus === 'Delivered') {
                    acc.deliveredOrders++;
                } else {
                    acc.pendingOrders++;
                }

                return acc;
            }, { totalOrders: 0, deliveredOrders: 0, pendingOrders: 0, totalSpent: 0 });

            return {
                userId: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                ...stats
            };
        });

        res.status(200).json({
            code: 200,
            status: "Success!",
            data: {
                length: customerReport.length,
                results: customerReport
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            code: 500,
            status: "An error occurred! Check server logs for more info.",
            data: {}
        });
    }
};

// order Wise 
export const getOrderWiseData = async (req, res) => {
    try {
        const allOrders = await Order.find().lean();

        // Get user details in a single query
        const userIds = [...new Set(allOrders.map(o => o.userId))];
        const users = await User.find({ _id: { $in: userIds } })
            .select('name email phone')
            .lean();

        const userMap = users.reduce((acc, user) => {
            acc[user._id] = user;
            return acc;
        }, {});

        const orderReport = allOrders.map(order => {
            const user = userMap[order.userId] || {};
            const orderTotal = order.product_json.reduce(
                (sum, product) => sum + (product.productPrice * (product.quantity || 1)),
                0
            );

            return {
                orderId: order.ordId,
                orderDate: order.orderedDate,
                customerName: user.name || 'Unknown',
                customerEmail: user.email || 'N/A',
                customerPhone: user.phone || 'N/A',
                status: order.ordStatus,
                paymentType: order.paymentType,
                productCount: order.product_json.length,
                orderTotal: orderTotal,
                deliveryAddress: order.customer_address?.address || 'N/A'
            };
        });

        res.status(200).json({
            code: 200,
            status: "Success!",
            data: { length: orderReport.length, results: orderReport },

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
// Product Wise
export const getProductWiseData = async (req, res) => {
    try {
        const allOrders = await Order.find();
        const productReport = {};

        for (const order of allOrders) {
            for (const product of order.product_json) {
                const productId = product.productId.toString();

                if (!productReport[productId]) {
                    const productDetails = await Products.findById(productId);
                    productReport[productId] = {
                        productId: productId,
                        productName: product.prd_Name || productDetails?.prd_Name || 'Unknown',
                        category: product.categoryName || productDetails?.categoryName || 'N/A',
                        // totalSold: 0,
                        totalQuantity: 0,
                        totalRevenue: 0,
                        ordersCount: 0
                    };
                }

                const quantity = product.quantity || 1;
                const revenue = product.productPrice * quantity;

                // productReport[productId].totalSold++;
                productReport[productId].totalQuantity += quantity;
                productReport[productId].totalRevenue += revenue;
                productReport[productId].ordersCount++;
            }
        }
        const productData = Object.values(productReport);
        res.status(200).json({
            code: 200,
            status: "Success!",
            data: { length: productData.length, results: productData },

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
// Dashboard Data 
export const getDashboardStats = async (req, res) => {
    try {
        const [
            allOrders,
            orderStatusBreakdown,
            deliveredOrders,
            allUsers
        ] = await Promise.all([
            Order.find().lean(),
            Order.aggregate([
                { $group: { _id: "$ordStatus", count: { $sum: 1 } } }
            ]),
            Order.find({ ordStatus: 'Delivered' }).lean(),
            User.find().lean()
        ]);

        // 1. Correct Sales and Refund Stats
        let totalSales = 0;
        let totalRefund = 0;

        deliveredOrders.forEach(order => {
            const totalPrice = order.totalPrice || 0;
            const refundAmount = order.refundamount || 0;

            totalSales += totalPrice;
            totalRefund += refundAmount;
        });

        const subTotal = totalSales - totalRefund;

        // 2. Order Status Breakdown (Pie Chart)
        const statusPieData = orderStatusBreakdown.map(item => ({
            name: item._id,
            value: item.count
        }));

        // 3. Monthly Sales Breakdown
        const allMonths = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const monthlySalesObj = {};
        const monthlySalesArray = allMonths.map(month => {
            monthlySalesObj[month] = {
                month,
                totalSales: 0,
                totalOrderCount: 0
            };
            return monthlySalesObj[month];
        });

        deliveredOrders.forEach(order => {
            const orderDate = new Date(order.orderedDate || order.createdAt);
            const orderMonth = orderDate.toLocaleString('default', { month: 'long' });

            if (monthlySalesObj[orderMonth]) {
                const totalPrice = order.totalPrice || 0;
                const refundAmount = order.refundamount || 0;
                const orderSubTotal = totalPrice - refundAmount;

                monthlySalesObj[orderMonth].totalSales += orderSubTotal;
                monthlySalesObj[orderMonth].totalOrderCount++;
            }
        });

        // 4. Send final response
        res.status(200).json({
            code: 200,
            status: "Success!",
            data: {
                summaryStats: {
                    totalSales,           // Raw total from all delivered orders
                    totalRefund,          // Sum of refund amounts
                    subTotal,             // Net revenue
                    totalOrders: allOrders.length,
                    deliveredOrders: deliveredOrders.length,
                    pendingOrders: allOrders.length - deliveredOrders.length,
                    totalCustomers: allUsers.length
                },
                statusDistribution: statusPieData,
                monthlyTrends: monthlySalesArray
            }
        });

    } catch (error) {
        console.error("getDashboardStats error:", error);
        res.status(500).json({
            code: 500,
            status: "Server Error!",
            data: null
        });
    }
};

// Customer Wise with date
export const getCustomerWiseDatawithdate = async (req, res) => {
    try {
        // Parse date filters from query
        const { startDate, endDate } = req.query;
        let dateFilter = {};
        if (startDate && endDate) {
            dateFilter.orderedDate = {
                $gte: new Date(startDate),
                $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999))
            };
        } else if (startDate) {
            dateFilter.orderedDate = { $gte: new Date(startDate) };
        } else if (endDate) {
            dateFilter.orderedDate = {
                $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999))
            };
        }

        // Get orders filtered by date range
        const ordersByUser = await Order.find(dateFilter).lean();

        // Extract unique user IDs from the filtered orders
        const userIds = [...new Set(ordersByUser.map(order => order.userId.toString()))];

        // Get only users who have orders in the date range
        const usersWithOrders = await User.find({
            _id: { $in: userIds }
        }).select('name email phone');

        const userOrderMap = {};

        ordersByUser.forEach(order => {
            const userIdStr = order.userId.toString();
            if (!userOrderMap[userIdStr]) {
                userOrderMap[userIdStr] = [];
            }
            userOrderMap[userIdStr].push(order);
        });

        // Build customer report only for users with orders in the date range
        const customerReport = usersWithOrders.map(user => {
            const userOrders = userOrderMap[user._id.toString()] || [];

            const stats = userOrders.reduce((acc, order) => {
                const orderValue = order.product_json.reduce(
                    (sum, product) => sum + (product.productPrice * (product.quantity || 1)),
                    0
                );

                acc.totalOrders++;
                acc.totalSpent += orderValue;

                if (order.ordStatus === 'Delivered') {
                    acc.deliveredOrders++;
                } else {
                    acc.pendingOrders++;
                }

                return acc;
            }, { totalOrders: 0, deliveredOrders: 0, pendingOrders: 0, totalSpent: 0 });

            return {
                userId: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                ...stats
            };
        });

        res.status(200).json({
            code: 200,
            status: "Success!",
            data: {
                length: customerReport.length,
                results: customerReport
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            code: 500,
            status: "An error occurred! Check server logs for more info.",
            data: {}
        });
    }
};
// order Wise with Date
export const getOrderWiseDatawithdate = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        let dateFilter = {};
        if (startDate && endDate) {
            dateFilter.orderedDate = {
                $gte: new Date(startDate),
                $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999))
            };
        } else if (startDate) {
            dateFilter.orderedDate = { $gte: new Date(startDate) };
        } else if (endDate) {
            dateFilter.orderedDate = {
                $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999))
            };
        }

        // Fetch only filtered orders, and sort by latest order first
        const allOrders = await Order.find(dateFilter)
            .sort({ orderedDate: -1 }) // ✅ latest order first
            .lean();

        // Get user details in a single query
        const userIds = [...new Set(allOrders.map(o => o.userId))];
        const users = await User.find({ _id: { $in: userIds } })
            .select('name email phone')
            .lean();

        const userMap = users.reduce((acc, user) => {
            acc[user._id] = user;
            return acc;
        }, {});

        const orderReport = allOrders.map(order => {
            const user = userMap[order.userId] || {};
            const orderTotal = order.product_json.reduce(
                (sum, product) => sum + (product.productPrice * (product.quantity || 1)),
                0
            );

            return {
                orderId: order.ordId,
                orderDate: order.orderedDate,
                customerName: user.name || 'Unknown',
                customerEmail: user.email || 'N/A',
                customerPhone: user.phone || 'N/A',
                status: order.ordStatus,
                paymentType: order.paymentType,
                productCount: order.product_json.length,
                orderTotal: orderTotal,
                deliveryAddress: order.customer_address?.address || 'N/A'
            };
        });

        res.status(200).json({
            code: 200,
            status: "Success!",
            data: { length: orderReport.length, results: orderReport },
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

// Product Wise With Date
export const getProductWiseDatawithdate = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        let dateFilter = {};
        if (startDate && endDate) {
            dateFilter.orderedDate = {
                $gte: new Date(startDate),
                $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999))
            };
        } else if (startDate) {
            dateFilter.orderedDate = { $gte: new Date(startDate) };
        } else if (endDate) {
            dateFilter.orderedDate = {
                $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999))
            };
        }

        // Fetch only filtered orders
        const allOrders = await Order.find(dateFilter).lean();
        const productReport = {};

        for (const order of allOrders) {
            for (const product of order.product_json) {
                const productId = product.productId.toString();

                if (!productReport[productId]) {
                    // Fetch product details from DB if not already present
                    const productDetails = await Products.findById(productId).lean();

                    productReport[productId] = {
                        productId: productId,
                        productName: product.prd_Name || productDetails?.prd_Name || 'Unknown',
                        category: product.categoryName || productDetails?.categoryName || 'N/A',
                        totalQuantity: 0,
                        totalRevenue: 0,
                        ordersCount: 0
                    };
                }

                const quantity = product.quantity || 1;
                const revenue = product.productPrice * quantity;

                productReport[productId].totalQuantity += quantity;
                productReport[productId].totalRevenue += revenue;
                productReport[productId].ordersCount++;
            }
        }

        const productData = Object.values(productReport);

        res.status(200).json({
            code: 200,
            status: "Success!",
            data: { length: productData.length, results: productData }
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



