import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import {
  assignOrder,
  deliverOrder,
  acceptOrder,
  cancelOrder,
} from "../../redux/slices/orderNotification";
import { fetchOrderById } from "../../redux/slices/ordersSlice";
import { FaShareAlt } from "react-icons/fa";

const OrderDetailsHeader = ({
  orderDetails,
  selectedProductIds,
  isAllSelected,
}) => {
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [partialAcceptMessage, setPartialAcceptMessage] = useState("");
  const [showMessageInput, setShowMessageInput] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [currentAction, setCurrentAction] = useState(null); // Track which action is loading
  const userDetails = JSON.parse(sessionStorage.getItem("entry"));
  const dispatch = useDispatch();

  const handleStatusUpdate = async (status, message = "") => {
    try {
      setCurrentAction(status); // Set the current action for loading

      switch (status) {
        case "Fully Accepted":
        case "Partially Accepted":
          await dispatch(
            acceptOrder({
              id: orderDetails?._id,
              body: {
                accepted_by: userDetails?._id,
                acceptedProductIds: selectedProductIds.map((id) => ({
                  productId: id,
                })),
                ...(message && { ordmessage: message }),
              },
            })
          ).unwrap();
          await dispatch(fetchOrderById(orderDetails?._id));
          break;

        case "Assigned":
          await dispatch(
            assignOrder({
              id: orderDetails?._id,
              body: {
                assign_by: userDetails?._id,
              },
            })
          ).unwrap();
          await dispatch(fetchOrderById(orderDetails?._id));
          break;

        case "Delivered":
          await dispatch(
            deliverOrder({
              id: orderDetails?._id,
              body: {
                deliver_by: userDetails?._id,
              },
            })
          ).unwrap();
          await dispatch(fetchOrderById(orderDetails?._id));
          break;

        case "Cancelled":
          await dispatch(
            cancelOrder({
              id: orderDetails?._id,
              body: {
                cancel_by: userDetails?._id,
                cancel_reason: cancelReason,
              },
            })
          ).unwrap();
          await dispatch(fetchOrderById(orderDetails?._id));
          break;

        default:
          break;
      }

      // Close dropdowns and reset states on success
      setIsStatusDropdownOpen(false);
      setShowMessageInput(false);
      setShowCancelPopup(false);
      setPartialAcceptMessage("");
      setCancelReason("");
    } catch (error) {
      console.error("Failed to update order status:", error);
      // You might want to add error handling here (e.g., show a toast notification)
    } finally {
      setCurrentAction(null); // Reset loading state
    }
  };

  const handleStatusChange = (newStatus) => {
    if (newStatus === "Partially Accepted") {
      setShowMessageInput(true);
    } else if (newStatus === "Cancelled") {
      setShowCancelPopup(true);
    } else {
      handleStatusUpdate(newStatus);
    }
  };

  const statusOptions = () => {
    switch (orderDetails?.ordStatus) {
      case "Open":
        return (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
            <div className="py-1">
              <button
                onClick={() => handleStatusChange("Fully Accepted")}
                disabled={
                  !isAllSelected ||
                  selectedProductIds.length === 0 ||
                  currentAction === "Fully Accepted"
                }
                className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                  !isAllSelected ||
                  selectedProductIds.length === 0 ||
                  currentAction === "Fully Accepted"
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                {currentAction === "Fully Accepted"
                  ? "Processing..."
                  : "Fully Accept"}
              </button>
              <button
                onClick={() => handleStatusChange("Partially Accepted")}
                disabled={
                  isAllSelected ||
                  selectedProductIds.length === 0 ||
                  currentAction === "Partially Accepted"
                }
                className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                  isAllSelected ||
                  selectedProductIds.length === 0 ||
                  currentAction === "Partially Accepted"
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                {currentAction === "Partially Accepted"
                  ? "Processing..."
                  : "Partially Accept"}
              </button>
              <button
                onClick={() => handleStatusChange("Cancelled")}
                className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer ${
                  currentAction === "Cancelled"
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={currentAction === "Cancelled"}
              >
                {currentAction === "Cancelled"
                  ? "Processing..."
                  : "Cancel Order"}
              </button>
            </div>
          </div>
        );
      case "Accepted":
        return (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
            <div className="py-1">
              <button
                onClick={() => handleStatusUpdate("Assigned")}
                className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer ${
                  currentAction === "Assigned"
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={currentAction === "Assigned"}
              >
                {currentAction === "Assigned"
                  ? "Processing..."
                  : "Assign Order"}
              </button>
              <button
                onClick={() => handleStatusChange("Cancelled")}
                className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer ${
                  currentAction === "Cancelled"
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={currentAction === "Cancelled"}
              >
                {currentAction === "Cancelled"
                  ? "Processing..."
                  : "Cancel Order"}
              </button>
            </div>
          </div>
        );
      case "Assigned":
        return (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
            <div className="py-1">
              <button
                onClick={() => handleStatusUpdate("Delivered")}
                className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer ${
                  currentAction === "Delivered"
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={currentAction === "Delivered"}
              >
                {currentAction === "Delivered"
                  ? "Processing..."
                  : "Mark as Delivered"}
              </button>
              <button
                onClick={() => handleStatusChange("Cancelled")}
                className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer ${
                  currentAction === "Cancelled"
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={currentAction === "Cancelled"}
              >
                {currentAction === "Cancelled"
                  ? "Processing..."
                  : "Cancel Order"}
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      case "Accepted":
        return "bg-yellow-100 text-yellow-800";
      case "Assigned":
        return "bg-blue-100 text-blue-800";
      case "Delivered":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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

  const isScheduleDatePassedOrToday = () => {
    const today = new Date();
    const scheduleDate = new Date(orderDetails?.scheduleDate);

    // Strip the time part to only compare dates
    today.setHours(0, 0, 0, 0);
    scheduleDate.setHours(0, 0, 0, 0);

    return today >= scheduleDate;
  };
  const handleShare = async () => {
    const currentUrl = window.location.href;

    let shareUrl = currentUrl;
    if (currentUrl.includes("/order-details/")) {
      shareUrl = currentUrl.replace("/order-details/", "/order-details-share/");
    }

    try {
      if (navigator.share) {
        // ✅ Native share dialog
        await navigator.share({
          title: document.title,
          url: shareUrl,
        });
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        // ✅ Modern clipboard API
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied to clipboard!");
      } else {
        // ✅ Fallback method for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  return (
    <div className="flex justify-between items-start mb-4">
      <div>
        <h2 className="text-xl font-semibold">Order #{orderDetails?.ordId}</h2>
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

      <div className="relative flex items-center gap-5">
        <button
          onClick={handleShare}
          className="p-2 rounded-full cursor-pointer hover:bg-gray-200 transition"
        >
          <FaShareAlt size={20} />
        </button>
        <button
          onClick={() =>
            !currentAction && setIsStatusDropdownOpen(!isStatusDropdownOpen)
          }
          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
            orderDetails?.ordStatus
          )} ${
            currentAction || !isScheduleDatePassedOrToday()
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:opacity-80"
          }`}
          disabled={!!currentAction || !isScheduleDatePassedOrToday()}
        >
          {orderDetails?.ordStatus}
          {currentAction && " (Updating...)"}
        </button>

        {isStatusDropdownOpen && statusOptions()}

        {showMessageInput && (
          <div className="absolute right-0 mt-2 p-4 bg-white rounded-md shadow-lg z-10 w-64">
            <textarea
              value={partialAcceptMessage}
              onChange={(e) => setPartialAcceptMessage(e.target.value)}
              placeholder="Enter reason for partial acceptance..."
              className="w-full p-2 border rounded mb-2"
              rows="3"
              disabled={
                currentAction === "Partially Accepted" ||
                !isScheduleDatePassedOrToday()
              }
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowMessageInput(false);
                  setPartialAcceptMessage("");
                }}
                className="px-3 py-1 text-sm bg-gray-200 rounded cursor-pointer hover:bg-gray-300"
                disabled={currentAction === "Partially Accepted"}
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  handleStatusUpdate("Partially Accepted", partialAcceptMessage)
                }
                className={`px-3 py-1 text-sm bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 ${
                  currentAction === "Partially Accepted"
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={currentAction === "Partially Accepted"}
              >
                {currentAction === "Partially Accepted"
                  ? "Submitting..."
                  : "Submit"}
              </button>
            </div>
          </div>
        )}

        {/* Cancel Order Popup */}
        {showCancelPopup && (
          <div className="absolute right-0 mt-2 p-4 bg-white rounded-md shadow-lg z-10 w-64">
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Enter reason for cancellation..."
              className="w-full p-2 border rounded mb-2"
              rows="3"
              disabled={
                currentAction === "Cancelled" || !isScheduleDatePassedOrToday()
              }
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowCancelPopup(false);
                  setCancelReason("");
                }}
                className="px-3 py-1 text-sm bg-gray-200 rounded cursor-pointer hover:bg-gray-300"
                disabled={currentAction === "Cancelled"}
              >
                Cancel
              </button>
              <button
                onClick={() => handleStatusUpdate("Cancelled")}
                className={`px-3 py-1 text-sm bg-red-500 text-white rounded cursor-pointer hover:bg-red-600 ${
                  currentAction === "Cancelled"
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={currentAction === "Cancelled" || !cancelReason.trim()}
              >
                {currentAction === "Cancelled"
                  ? "Cancelling..."
                  : "Confirm Cancel"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailsHeader;
