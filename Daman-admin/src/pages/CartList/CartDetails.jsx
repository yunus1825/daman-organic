import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartItemById } from "../../redux/slices/cartDetails";
import { useParams } from "react-router-dom";
import Loader from "../../components/Loader";
import ErrorComponent from "../../components/ErrorComponent";

const CartDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { loading, error, cartItemDetails } = useSelector(
    (state) => state.cartDetails
  );

  useEffect(() => {
    dispatch(fetchCartItemById(id));
  }, [dispatch, id]);

  if (loading) return <Loader />;
  if (error) return <ErrorComponent message={error} />;

  const items = cartItemDetails || [];

  // Calculate total price
  const totalPrice = items?.reduce((sum, item) => {
    const product = item.product;
    const variant = product?.variantData;
    const price = variant ? variant.selling_Price : product?.selling_price;
    return sum + price * item.quantity;
  }, 0);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Cart Details</h2>
        <span className="text-lg font-semibold bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
          {items?.length} {items?.length === 1 ? "Item" : "Items"}
        </span>
      </div>

      <div className="space-y-4">
        {items.map((item) => {
          const product = item.product;
          const variant = product?.variantData;
          const price = variant
            ? variant.selling_Price
            : product?.selling_price;
          const displayPrice = variant
            ? variant.display_price
            : product?.display_price;

          return (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100"
            >
              <div className="flex flex-col sm:flex-row gap-6">
                <img
                  src={product?.image}
                  alt={product?.prd_Name}
                  className="w-full sm:w-32 h-32 object-contain rounded-lg bg-gray-50 p-2"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {product?.prd_Name}
                    </h3>
                    <span className="text-lg font-bold text-blue-600">
                      ₹{price * item.quantity}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{product?.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-500 font-medium">Unit Price</p>
                      <p className="font-semibold">₹{price}</p>
                      {displayPrice && (
                        <p className="text-xs text-gray-400 line-through">
                          ₹{displayPrice}
                        </p>
                      )}
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-500 font-medium">Subtotal</p>
                      <p className="font-semibold">{item.quantity} * {price} = ₹{price * item.quantity}</p>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-500 font-medium">In Cart For</p>
                      <p className="font-semibold text-blue-600">
                        {item.daysInCart} day{item.daysInCart > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Order Summary
            </h3>
          </div>
          <div className="text-right">
            <p className="text-gray-600">Total ({items.length} items)</p>
            <p className="text-2xl font-bold text-gray-900">
              ₹{totalPrice.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartDetails;
