import { motion } from "framer-motion";
import { FaPlus } from "react-icons/fa";
import RouterLink from "../../../components/global/RouterLink";
import LoadingSpinner from "../../../components/global/LoadingSpinner";
import ErrorMessage from "../../../components/global/ErrorMessage";
import EmptyCartMessage from "../../../components/global/EmptyCartMessage";

const CartStep = ({
  cart,
  updateQuantity,
  cartLoading,
  cartError,
  removeItem,
  nextStep,
}) => {
  const getItemPrice = (item) => {
    return item.product?.variantData
      ? item.product.variantData.selling_Price
      : item.product?.selling_price;
  };
  const getStockStatus = (item) => {
    // Check variant-level stock
    return item.product?.variantData
      ? item.product?.variantData?.inStock
      : item.product?.status;
  };
  if (cartLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner size="large"></LoadingSpinner>
      </div>
    );
  }

  if (cartError) {
    return (
      <div className="flex justify-center items-center py-8">
        <ErrorMessage
          message={cartError}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Cart</h2>

      {cart.length === 0 ? (
        <div className="text-center py-8">
          <EmptyCartMessage></EmptyCartMessage>
        </div>
      ) : (
        <>
          {/* Mobile view - stacked cards */}
          <div className="lg:hidden space-y-4 mb-6">
            {cart.map((item) => {
              const price = getItemPrice(item);
              const variant = item.product?.variantData;
              const unit_value = variant
                ? variant.quantity
                : item?.product.quantity;
              const unit_type = variant ? variant.Type : item?.product.Type;
              return (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden">
                      <img
                        src={item.product?.image}
                        alt={item.product?.prd_Name}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{item.product?.prd_Name}</h3>
                      <p className="text-sm text-gray-500">
                        {`${unit_value} ${unit_type}`}{" "}
                        {!getStockStatus(item) && (
                          <span className="text-red-500">Out of stock</span>
                        )}
                      </p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-medium">
                        Rs {(price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center cursor-pointer space-x-3">
                    <button
                      onClick={() => removeItem(item._id)}
                      className="text-red-500 cursor-pointer hover:text-red-700"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Desktop view - table layout */}
          <div className="hidden lg:block mb-8">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left pb-3 font-medium text-gray-600">
                    Product
                  </th>
                  <th className="text-center pb-3 font-medium text-gray-600">
                    Price
                  </th>
                  <th className="text-center pb-3 font-medium text-gray-600">
                    Qty
                  </th>
                  <th className="text-right pb-3 font-medium text-gray-600">
                    Total
                  </th>
                  <th className="text-right pb-3 font-medium text-gray-600"></th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => {
                  const price = getItemPrice(item);
                  const variant = item.product?.variantData;
                  const unit_value = variant
                    ? variant.quantity
                    : item?.product.quantity;
                  const unit_type = variant ? variant.Type : item?.product.Type;
                  return (
                    <motion.tr
                      key={item._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b"
                    >
                      <td className="py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden">
                            <img
                              src={item.product?.image}
                              alt={item.product?.prd_Name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div>{item.product?.prd_Name}</div>
                            <div className="text-sm flex items-end gap-2 text-gray-500">
                              <p>{`${unit_value} ${unit_type}`}</p>{" "}
                              {!item?.product?.status && (
                                <span className="text-red-500">
                                  Out of stock
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="text-center">Rs {price?.toFixed(2)}</td>
                      <td className="text-center">{item.quantity}</td>
                      <td className="text-right">
                        Rs {(price * item.quantity).toFixed(2)}
                      </td>
                      <td className="text-right">
                        <button
                          onClick={() => removeItem(item._id)}
                          className="text-red-500 cursor-pointer hover:text-red-700"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="lg:hidden border-t pt-4 mb-6">
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>
                Rs{" "}
                {cart
                  ?.reduce(
                    (sum, item) => sum + getItemPrice(item) * item.quantity,
                    0
                  )
                  ?.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-2">
            <RouterLink to={"/"} className="w-full">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full text-nowrap bg-gray-200 py-3 flex justify-center gap-2 items-center rounded-lg font-medium hover:bg-gray-300 cursor-pointer transition text-lg"
              >
                <span>
                  <FaPlus />{" "}
                </span>
                Add more items
              </motion.button>
            </RouterLink>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={nextStep}
              className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primaryDark cursor-pointer transition text-lg"
              disabled={cart.length === 0}
            >
              Proceed to Checkout
            </motion.button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartStep;
