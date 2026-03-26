// components/OrdersDropdown.js
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderNotifications } from "../../redux/slices/orderNotification";

const OrdersDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [previousOrdersLength, setPreviousOrdersLength] = useState(0);
  const toggleDropdown = () => setIsOpen(!isOpen);
  const navigate = useNavigate();
  const { error, orders } = useSelector((state) => state.orderNotification);
  const dispatch = useDispatch();

  // Memoized fetch function
  const fetchOrders = useCallback(() => {
    dispatch(fetchOrderNotifications());
  }, [dispatch]);

  // Polling effect
  useEffect(() => {
    fetchOrders(); // Initial fetch

    const intervalId = setInterval(fetchOrders, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [fetchOrders]);

  // Effect to compare orders length and open dropdown if new orders arrive
  useEffect(() => {
    if (orders?.length > previousOrdersLength) {
      setIsOpen(true);
    }
    setPreviousOrdersLength(orders?.length || 0);
  }, [orders, previousOrdersLength]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Add when the dropdown is open
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Animation variants for framer motion
  const dropdownVariants = {
    hidden: {
      y: "100%",
      opacity: 0,
      transition: { duration: 0.2 },
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05,
        when: "beforeChildren",
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div
      className="fixed bottom-0 right-0 z-50 w-full md:w-[600px]"
      ref={dropdownRef}
    >
      <motion.button
        onClick={toggleDropdown}
        className="bg-gray-900 cursor-pointer text-white p-3 shadow-lg w-full transition-colors flex items-center justify-between"
      >
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <p>Orders ({orders?.length})</p>
        )}
        {isOpen ? (
          <ChevronDown className="w-6 h-6" />
        ) : (
          <ChevronUp className="w-6 h-6" />
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={dropdownVariants}
            className="border absolute bottom-full  right-0 w-full md:w-[600px] max-h-[80vh] overflow-y-auto bg-white rounded-t-lg shadow-2xl"
          >
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Recent Orders ({orders.length})
              </h3>
              <div className="space-y-3">
                {orders.map((order) => (
                  <motion.div
                    key={order._id}
                    onClick={() => {
                      navigate(`/order-details/${order._id}`);
                      toggleDropdown();
                    }}
                    variants={itemVariants}
                    className="p-3 bg-gray-50 cursor-pointer rounded-lg border border-gray-200 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">
                          {order.ordId}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.UserName}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          order.ordStatus === "Open"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.ordStatus === "Accepted"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {order.ordStatus}
                      </span>
                    </div>

                    <div className="mt-2 flex justify-between text-sm">
                      <span className="text-gray-500">{order.OrderDate}</span>
                      <span className="text-gray-500">{order.PaymentType}</span>
                      <span className="font-medium">
                        {order.TotalProductsCount > 1 ? "items " : "item "}(
                        {order.TotalProductsCount}) ₹ {order.subTotal}
                      </span>
                    </div>

                    {/* Add schedule information here */}
                    {(order.scheduleDate || order.scheduleTime) && (
                      <div className="mt-1 flex justify-between text-sm">
                        {order.scheduleDate && (
                          <span className="text-gray-500">
                            Scheduled: {order.scheduleDate}
                          </span>
                        )}
                        {order.scheduleTime && (
                          <span className="text-gray-500">
                            {order.scheduleTime}
                          </span>
                        )}
                      </div>
                    )}

                    {order.ordmessage && (
                      <p className="mt-1 text-xs text-gray-500 italic">
                        {order.ordmessage}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrdersDropdown;
