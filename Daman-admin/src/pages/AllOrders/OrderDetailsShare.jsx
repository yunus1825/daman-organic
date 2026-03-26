import React, { useEffect, useState } from "react";
import { fetchOrderById } from "../../redux/slices/ordersSlice";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ErrorComponent from "../../components/ErrorComponent";
import Loader from "../../components/Loader";
import Logo from "../../assets/damanheaderlogo.png";
const OrderDetailsShare = () => {
  const dispatch = useDispatch();
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const { orderId } = useParams();
  const { orderDetails, loading, error } = useSelector((store) => store.orders);
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    dispatch(fetchOrderById(orderId));
  }, [dispatch, orderId]);

  if (loading) return <Loader />;
  if (error) return <ErrorComponent message={error} />;
  if (!orderDetails) return <div>No order details found</div>;
  const allProductIds =
    orderDetails?.product_json?.map(
      (item) => item._id || item.productDetail?._id
    ) || [];

  const isAllSelected =
    allProductIds.length > 0 &&
    selectedProductIds.length === allProductIds.length;
  return (
    <div className="container max-w-6xl bg-gray-100 rounded-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold ">Order Details</h1>

        <img src={Logo} alt="logo" className="h-10 md:h-20" />
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold">
              Order #{orderDetails?.ordId}
            </h2>
            <p className="text-gray-600 font-semibold">
              Placed on : {formatDate(orderDetails?.orderedDate)}
            </p>
            {orderDetails?.scheduleDate && (
              <p className="text-gray-600 font-semibold">
                Schedule Date : {orderDetails.scheduleDate}
              </p>
            )}

            {orderDetails?.scheduleTime && (
              <p className="text-gray-600 font-semibold">
                Schedule Time : {orderDetails.scheduleTime}
              </p>
            )}
          </div>
        </div>
        {/* <OrderDetailsHeader
          orderDetails={orderDetails}
          selectedProductIds={selectedProductIds}
          isAllSelected={isAllSelected}
        /> */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-2">Payment Method</h3>
            <p className="text-gray-900">{orderDetails?.paymentType}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-2">Total Amount</h3>
            <p className="text-gray-900">₹{orderDetails?.SubTotal}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-2">Customer</h3>
            <p className="text-gray-900">{orderDetails?.UserName}</p>
          </div>
        </div>
      </div>
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

      {/* Shipping Address */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="font-medium">
            {orderDetails?.customer_address?.addressType}
          </p>
          <p className="text-gray-700">
            Appartment/Building Name :{" "}
            {orderDetails?.customer_address?.appartment_name}, <br />
            FlatNo/House No : {orderDetails?.customer_address?.flatNo},<br />{" "}
            Street : {orderDetails?.customer_address?.street},<br />
            Address : {orderDetails?.customer_address?.address}, <br />
            Area : {orderDetails?.customer_address?.area},<br /> City :{" "}
            {orderDetails?.customer_address?.city},<br /> Pincode :{" "}
            {orderDetails?.customer_address?.pincode}
            <br />
            {orderDetails?.customer_address?.landmark &&
              `Landmark: ${orderDetails?.customer_address?.landmark}`}
          </p>
          <p className="mt-2 text-gray-700">
            Phone: {orderDetails?.customer_address?.phoneNo}
          </p>
          <p className="mt-2 text-gray-700">
            Email : {orderDetails?.customer_address?.email}
          </p>
          <p className="mt-2 text-gray-700">
            Customer Name : {orderDetails?.customer_address?.customer_name}
          </p>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Order Items</h2>
        <div className="divide-y divide-gray-200">
          {/* <div className="flex items-center mb-4">
            <input
              type="checkbox"
              className={`mr-4 h-5 w-5 mt-1 mb-2  ${
                orderDetails?.ordStatus !== "Open"
                  ? "cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              checked={isAllSelected}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedProductIds(allProductIds);
                } else {
                  setSelectedProductIds([]);
                }
              }}
              disabled={orderDetails?.ordStatus !== "Open"}
            />
            <label className="font-medium text-gray-700">
              Select All Products
            </label>
          </div> */}

          {orderDetails?.product_json?.map((item, index) => {
            const getItemPrice = (item) => {
              return item.selectedVariant
                ? item.selectedVariant?.selling_Price
                : item.productPrice;
            };

            const price = getItemPrice(item);
            const variant = item.selectedVariant;
            const quantity = item.quantity;
            const unit_value = variant
              ? variant.quantity
              : item?.productDetail?.quantity;
            const unit_type = variant
              ? variant.Type
              : item?.productDetail?.Type;

            return (
              <div
                key={index}
                className="py-4 flex flex-col md:flex-row items-center"
                style={{
                  ...(orderDetails?.ordStatus !== "Open"
                    ? {
                        opacity: item.isAccepted ? 1 : 0.4,
                        textDecoration: item.isAccepted
                          ? "none"
                          : "line-through",
                      }
                    : {}), // fallback if not open
                }}
              >
                {/* <input
                  type="checkbox"
                  className={`mr-4 h-5 w-5 mt-1  ${
                    orderDetails?.ordStatus !== "Open"
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                  checked={
                    selectedProductIds.includes(item.productId) ||
                    item.isAccepted
                  }
                  disabled={orderDetails?.ordStatus !== "Open"}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setSelectedProductIds((prev) =>
                      checked
                        ? [...prev, item.productId]
                        : prev.filter((id) => id !== item.productId)
                    );
                  }}
                /> */}
                <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                  <img
                    src={item?.productDetail?.image}
                    alt={item?.prd_Name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1  bg-white">
                  <div className="flex justify-between items-start">
                    {/* Left side: product details */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item?.prd_Name} ( {unit_value} {unit_type} )
                      </h3>
                      <p className="text-sm text-gray-500">
                        {item?.categoryName}
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <hr className="my-3 border-gray-200" />

                  {/* Breakdown details */}
                  <div className="md:flex justify-between text-sm text-gray-700">
                    <p>
                      Qty: <span className="font-medium">{quantity}</span>
                    </p>
                    <p>
                      Price: <span className="font-medium">₹ {price}</span>
                    </p>
                    <p>
                      Total:{" "}
                      <span className="text-lg font-bold">
                        {" "}
                        {quantity} × ₹{price} = ₹{quantity * price}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Total */}
        <div className="mt-6 border-t border-gray-200 pt-6">
          <div className="flex justify-between text-lg font-semibold">
            <span>Delivery Charges</span>
            <span>₹{orderDetails?.deliveryCharge}</span>
          </div>
        </div>
        {/* Order Total */}
        <div className="mt-6 border-t border-gray-200 pt-6">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>₹{orderDetails?.SubTotal}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsShare;
