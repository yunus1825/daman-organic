import React, { useEffect } from "react";
import OrderDetailItem from "./OrderDetailItem.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn, staggerContainer, slideIn } from "../../../utils/motion.js";
import { statusConfig } from "../../../constants/constants.js";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderById } from "../../../redux/slices/ordersSlice.js";
import { useParams } from "react-router-dom";
import { Spin } from "antd";

const OrderDetailsContainer = () => {
  const dispatch = useDispatch();
  const { orderDetails, loading, error } = useSelector((store) => store.orders);
  const { orderId } = useParams();

  useEffect(() => {
    dispatch(fetchOrderById(orderId));
  }, [dispatch, orderId]);

  if (loading)
    return (
      <div className="h-[80vh] flex justify-center items-center">
        <Spin size="large"></Spin>
      </div>
    );
  if (error)
    return (
      <div className="h-[80vh] flex justify-center items-center">
        Error: {error}
      </div>
    );

  const getItemPrice = (item) => {
    return item.product?.variantData
      ? item.product.variantData.selling_Price
      : item.product?.selling_price;
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={staggerContainer}
      className="p-3 mx-auto overflow-hidden"
    >
      <motion.h1
        variants={fadeIn("down", "spring", 0.1, 0.5)}
        className="text-xl font-medium mb-6 text-gray-800"
      >
        Order #{orderDetails?.ordId}
      </motion.h1>
      {orderDetails?.scheduleDate && (
        <motion.h1
          variants={fadeIn("down", "spring", 0.1, 0.5)}
          className=" text-gray-800"
        >
          Schedule Date : {orderDetails.scheduleDate}
        </motion.h1>
      )}
      {orderDetails?.scheduleTime && (
        <motion.h1
          variants={fadeIn("down", "spring", 0.1, 0.5)}
          className=" text-gray-800 mb-2"
        >
          Schedule Time : {orderDetails.scheduleTime}
        </motion.h1>
      )}

      {/* Warning message if ordMessage exists */}
      {orderDetails.ordmessage && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                {orderDetails.ordmessage}
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Danger message if ordMessage exists */}
      {orderDetails.cancel_reason && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {orderDetails.cancel_reason}
              </p>
            </div>
          </div>
        </div>
      )}
      {/* green message if RefundAmount exists */}
      {orderDetails.RefundAmount > 0 && orderDetails.paymentType !== "COD" && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12h2.5l-3 3-3-3H4c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10c-2.21 0-4.23-.72-5.88-1.93l1.42-1.42A7.962 7.962 0 0012 20c4.42 0 8-3.58 8-8s-3.58-8-8-8zm-1 5v3H8l4 4 4-4h-3V7h-2z" />
              </svg>
            </div>
            <div className="ml-3 flex items-center gap-2">
              <p className="text-sm text-green-700 font-bold">
                Amout Refunded :
              </p>
              <p className="text-sm text-green-700">
                ₹ {orderDetails.RefundAmount}
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="md:grid md:grid-cols-3 gap-5">
        {/* Left Column */}
        <div className="col-span-2">
          <motion.div
            variants={slideIn("left", "tween", 0.2, 1)}
            className="border-[1px] shadow mb-2 md:mb-0 rounded-2xl border-primary p-3 bg-white"
          >
            <AnimatePresence>
              {orderDetails.product_json?.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <OrderDetailItem
                    item={item}
                    orderId={orderDetails?.ordId}
                    orderStatus={orderDetails?.ordStatus}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            <motion.div
              variants={fadeIn("up", "tween", 0.5, 0.5)}
              className="mt-5 p-3 bg-gray-50 rounded-lg"
            >
              <p className="font-semibold text-gray-700">Order Placed</p>
              <p className="font-light text-gray-600">
                Your order has been placed.
              </p>
              <p className="font-light text-gray-500">
                {new Date(orderDetails?.orderedDate).toLocaleString()}
              </p>
            </motion.div>
            {orderDetails?.acceptedDate && (
              <motion.div
                variants={fadeIn("up", "tween", 0.5, 0.5)}
                className="mt-5 p-3 bg-gray-50 rounded-lg"
              >
                <p className="font-semibold text-gray-700">Order Accepted</p>
                <p className="font-light text-gray-600">
                  Your order has been Accepted.
                </p>
                <p className="font-light text-gray-500">
                  {new Date(orderDetails.acceptedDate).toLocaleString()}
                </p>
              </motion.div>
            )}

            {orderDetails?.assignDate && (
              <motion.div
                variants={fadeIn("up", "tween", 0.5, 0.5)}
                className="mt-5 p-3 bg-gray-50 rounded-lg"
              >
                <p className="font-semibold text-gray-700">Order Assign</p>
                <p className="font-light text-gray-600">
                  Your order has been Assigned to Delivery Partner.
                </p>
                <p className="font-light text-gray-500">
                  {new Date(orderDetails.assignDate).toLocaleString()}
                </p>
              </motion.div>
            )}

            {orderDetails?.deliveredDate && (
              <motion.div
                variants={fadeIn("up", "tween", 0.5, 0.5)}
                className="mt-5 p-3 bg-gray-50 rounded-lg"
              >
                <p className="font-semibold text-gray-700">Order Delivered</p>
                <p className="font-light text-gray-600">
                  Your order has been Delivered.
                </p>
                <p className="font-light text-gray-500">
                  {new Date(orderDetails.deliveredDate).toLocaleString()}
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col w-full gap-3">
          {/* Order Summary */}
          <motion.div
            variants={slideIn("right", "tween", 0.3, 1)}
            className="border-[1px] shadow rounded-2xl w-full border-primary p-5 bg-white"
          >
            <motion.div
              variants={fadeIn("down", "spring", 0.2, 0.5)}
              className="font-bold text-lg flex justify-between items-center text-gray-800 mb-4"
            >
              <p>Order Summary</p>
              <p
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  statusConfig[orderDetails.ordStatus]?.color ||
                  statusConfig.default.color
                }`}
              >
                {statusConfig[orderDetails.ordStatus]?.icon ||
                  statusConfig.default.icon}{" "}
                {orderDetails.ordStatus}
              </p>
            </motion.div>

            <motion.div variants={staggerContainer}>
              <motion.div
                variants={fadeIn("up", "tween", 0.3, 0.5)}
                className="flex justify-between items-center border-b-[1px] my-3 border-gray-200 text-gray-500"
              >
                <p className="font-medium">Item</p>
                <p className="font-medium">Subtotal</p>
              </motion.div>

              <motion.div
                variants={fadeIn("up", "tween", 0.4, 0.5)}
                className="border-b-[1px] pb-3 border-gray-200"
              >
                {orderDetails.product_json?.map((item, index) => {
                  const variant = item?.selectedVariant;
                  const unit_value = variant
                    ? variant?.quantity
                    : item?.productDetail?.quantity;
                  const unit_type = variant
                    ? variant?.Type
                    : item?.productDetail?.Type;

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{
                        opacity:
                          orderDetails?.ordStatus !== "Open"
                            ? item.isAccepted
                              ? 1
                              : 0.5
                            : 1,
                        x: 0,
                      }}
                      transition={{ delay: index * 0.1 }}
                      className="flex justify-between items-center py-1"
                      style={{
                        textDecoration:
                          orderDetails?.ordStatus !== "Open" && !item.isAccepted
                            ? "line-through"
                            : "none",
                      }}
                    >
                      <p className="font-medium text-gray-700">
                        {item.prd_Name} {`(${unit_value} ${unit_type})`}{" "}
                        {item.quantity && `x ${item.quantity}`}
                      </p>
                      <p className="font-medium text-gray-700">
                        ₹ {item.productPrice * item.quantity}
                      </p>
                    </motion.div>
                  );
                })}
              </motion.div>
              {orderDetails?.deliveryCharge > 0 && (
                <motion.div
                  variants={fadeIn("up", "tween", 0.5, 0.5)}
                  className="flex justify-between my-3 items-center   border-gray-200"
                >
                  <p className="font-semibold text-gray-800">
                    Delivery Charges
                  </p>
                  <p className="font-semibold  text-lg">
                    ₹ {orderDetails?.deliveryCharge}
                  </p>
                </motion.div>
              )}
              <motion.div
                variants={fadeIn("up", "tween", 0.5, 0.5)}
                className={`flex justify-between my-3 items-center ${
                  orderDetails?.deliveryCharge > 0 && "border-t-[1px] pt-3"
                }  border-gray-200`}
              >
                <p className="font-bold text-gray-800">Total</p>
                <p className="font-bold text-primary text-lg">
                  ₹ {orderDetails?.SubTotal}
                </p>
              </motion.div>

              <motion.div
                variants={fadeIn("up", "tween", 0.6, 0.5)}
                className="flex justify-between items-center text-gray-500 mt-4 pt-3 border-t-[1px] border-gray-200"
              >
                <p>Payment Method</p>
                <p className="font-medium text-primary">
                  {orderDetails?.paymentType}
                </p>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Shipping Address */}
          <motion.div
            variants={slideIn("right", "tween", 0.4, 1)}
            className="border-[1px] rounded-2xl shadow border-primary p-5 bg-white"
          >
            <motion.div
              variants={fadeIn("down", "tween", 0.5, 0.5)}
              className="flex justify-between pb-3 items-center border-b-[1px] border-gray-200"
            >
              <p className="font-bold text-gray-800">Shipping Address</p>
              <p className="font-medium text-primary bg-primary/10 px-2 py-1 rounded-full text-sm">
                {orderDetails?.customer_address?.addressType}
              </p>
            </motion.div>

            <motion.p
              variants={fadeIn("up", "tween", 0.6, 0.5)}
              className="font-light pb-3 text-gray-600 mt-3"
            >
              {[
                orderDetails?.customer_address?.flatNo,
                orderDetails?.customer_address?.appartment_name,
                orderDetails?.customer_address?.street,
                orderDetails?.customer_address?.area,
                orderDetails?.customer_address?.city,
                orderDetails?.customer_address?.pincode,
              ]
                .filter(Boolean)
                .join(", ")}
            </motion.p>

            <motion.p
              variants={fadeIn("up", "tween", 0.7, 0.5)}
              className="font-medium text-gray-700"
            >
              {orderDetails?.customer_address?.phoneNo}
            </motion.p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderDetailsContainer;
