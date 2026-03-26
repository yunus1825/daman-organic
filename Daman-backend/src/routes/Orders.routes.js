import express from "express";
import {
    createOrder,
    createOrderwithcart,
    getAllOrders,
    OrderDetails,
    getAllOrdersbyUser,
    OrderPaymentStatusSuccess,
    OrderPaymentStatusFailed,
    getDistanceById,
    getOrderNotification,
    AcceptOrder,
    AssignOrder,
    DeliveredOrder,
    cancelOrder,
    contactUsMail,

} from "../controllers/Orders.controller.js"

const router = express.Router();
router.post("/order_booking", createOrder);
router.post("/order_booking_by_user", createOrderwithcart);
router.get("/order_list", getAllOrders);
router.get("/order_details/:OrderId", OrderDetails);
router.get("/user_orders/:userId", getAllOrdersbyUser);
router.put("/payment_status_success/:ordId", OrderPaymentStatusSuccess);
router.put("/payment_status_failed/:ordId", OrderPaymentStatusFailed);
router.get("/ord_distance/:AddressId", getDistanceById);
router.get("/order_notification", getOrderNotification);
router.put("/acceptorder/:OrderId", AcceptOrder);
router.put("/assign_order/:OrderId", AssignOrder);
router.put("/deliver_order/:OrderId", DeliveredOrder);
router.put("/cancel_order/:OrderId", cancelOrder);
router.post("/contactus_mail", contactUsMail);












export default router;
