import React, { useEffect, useState } from "react";
import CartItem from "./CartItem";
import { currencySymbol } from "../../../constants/constants";
import RouterLink from "../../../components/global/RouterLink";
import { useSelector, useDispatch } from "react-redux";
import { fetchCart } from "../../../redux/slices/cartSlice";
import { message, Spin } from "antd";
import EmptyCartMessage from "../../../components/global/EmptyCartMessage";

const CartContainer = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.cart);
  const userId = useSelector((state) => state.auth.user?._id);

  useEffect(() => {
    if (userId) {
      dispatch(fetchCart(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

 const calculateTotals = () => {
  let subtotal = 0;
  let totalSavings = 0;
  let totalItems = 0;

  items.forEach((item) => {
    const product = item.product;
    const variant = product?.variantData;

    // Use variant selling price if present, else product selling price
    const sellingPrice = variant?.selling_Price ?? product?.selling_price;
    const displayPrice = product?.display_price;

    // Quantity of that item
    const quantity = item.quantity;

    subtotal += sellingPrice * quantity;

    // Only calculate savings if displayPrice is greater
    if (displayPrice && displayPrice > sellingPrice) {
      totalSavings += (displayPrice - sellingPrice) * quantity;
    }

    totalItems += quantity;
  });

  return { subtotal, totalSavings, totalItems };
};

  const { subtotal, totalSavings, totalItems } = calculateTotals();

  if (!items || items.length === 0) {
    return (
      <div
        className={`flex flex-col h-[80vh]  items-center justify-center `}
      >
       <EmptyCartMessage></EmptyCartMessage>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Spinner Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/20 bg-opacity-75 flex justify-center items-center z-50">
          <Spin tip="Loading your cart..." size="large" />
        </div>
      )}

      <div className={`${loading ? "opacity-50 pointer-events-none" : ""}`}>
        <div className="mb-5">
          <h3 className="font-semibold text-xl">Your Cart</h3>
          <div className="border-2 border-primary rounded-xl flex justify-between items-center px-5 py-8 mt-5 overflow-hidden">
            <div>
              <p>
                <span className="font-bold">Subtotal </span> ({totalItems} item
                {totalItems !== 1 ? "s" : ""}) :{" "}
                <span className="font-bold">{`${currencySymbol}${subtotal?.toFixed(
                  2
                )}`}</span>
              </p>
              {/* <p className="text-primaryDark">
                Savings:{" "}
                <span className="text-black font-bold">{`${currencySymbol}${totalSavings?.toFixed(
                  2
                )}`}</span>
              </p> */}
            </div>
            <div>
              <RouterLink
                to={"/checkout"}
                className={"px-10 py-3 rounded-sm text-white bg-primary"}
              >
                Checkout
              </RouterLink>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 text-gray-400">
          <p className="col-span-6">
            Items({totalItems} item{totalItems !== 1 ? "s" : ""})
          </p>
          <p className="col-span-3 text-center">Quantity</p>
          <p className="col-span-3 text-center">Sub Total</p>
        </div>

        <div>
          {items.map((item) => (
            <CartItem key={item._id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CartContainer;
