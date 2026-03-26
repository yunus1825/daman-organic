import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import { currencySymbol } from "../../constants/constants";
import DiscountTag from "../global/DiscountTag";
import RouterLink from "../global/RouterLink";
import OptionsDropdown from "../global/OptionsDropdown";
import HeartProduct from "./HeartProduct";
import { useSelector, useDispatch } from "react-redux";
import { message } from "antd";
import {
  addCartItem,
  removeCartItem,
  updateCartItemQuantity,
} from "../../redux/slices/cartSlice";
import LoginPopup from "../global/LoginPopup";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const ProductItem1 = ({ product = {} }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [isInCart, setIsInCart] = useState(false);
  const [cartItemId, setCartItemId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [error, setError] = useState(null);

  const userId = useSelector((state) => state.auth.user?._id);
  const cartItems = useSelector((state) => state.cart.items);

  // Handle initial variant selection based on cart items
  useEffect(() => {
    if (product?.variants?.length > 0 && cartItems.length > 0) {
      const cartItem = cartItems.find((item) => item.productId === product._id);
      if (cartItem?.variantId) {
        const variant = product.variants.find(
          (v) => v._id === cartItem.variantId
        );
        if (variant) {
          setSelectedVariant(variant);
        }
      }
    }
  }, [product, cartItems]);

  // Check if product is in cart when component mounts or dependencies change
  useEffect(() => {
    if (userId && product?._id) {
      checkIfInCart();
    }
  }, [userId, product?._id, cartItems, selectedVariant]);

  const checkIfInCart = () => {
    const cartItem = cartItems.find((item) => {
      // First check if product IDs match
      if (item.productId !== product._id) return false;

      // Then handle variant matching
      if (selectedVariant) {
        return item.variantId === selectedVariant._id;
      } else if (item.variantId) {
        // If no variant is selected but cart item has variant, check if product has this variant
        const variantExists = product.variants?.some(
          (v) => v._id === item.variantId
        );
        if (variantExists) {
          // Auto-select this variant if found
          const variant = product.variants.find(
            (v) => v._id === item.variantId
          );
          setSelectedVariant(variant);
          return true;
        }
        return false;
      }
      // If no variant in cart item and no variant selected
      return !item.variantId;
    });

    if (cartItem) {
      setIsInCart(true);
      setCartItemId(cartItem._id);
      setQuantity(cartItem.quantity);
    } else {
      setIsInCart(false);
      setCartItemId(null);
      setQuantity(1);
    }
  };

  const incrementQuantity = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    if (isInCart) {
      handleQuantityUpdate(newQuantity);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      if (isInCart) {
        handleQuantityUpdate(newQuantity);
      }
    }
  };

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
  };

  const handleAddToCart = async () => {
    if (!userId) {
      setShowLoginPopup(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await dispatch(
        addCartItem({
          userId,
          productId: product._id,
          quantity,
          variantId: selectedVariant?._id,
        })
      ).unwrap();
      setCartItemId(result._id);
      setIsInCart(true);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromCart = async () => {
    if (!cartItemId) return;

    setLoading(true);
    setError(null);

    try {
      await dispatch(removeCartItem(cartItemId)).unwrap();
      setIsInCart(false);
      setCartItemId(null);
      setQuantity(1);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityUpdate = async (newQuantity) => {
    setLoading(true);
    setError(null);

    try {
      await dispatch(
        updateCartItemQuantity({
          userId,
          productId: product._id,
          quantity: newQuantity,
          variantId: selectedVariant?._id,
        })
      ).unwrap();
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPrice = () => {
    if (selectedVariant) {
      return (
        selectedVariant.selling_Price ||
        selectedVariant.selling_price ||
        product.selling_price
      );
    }
    return product.selling_price;
  };

  const getDisplayPrice = () => {
    if (selectedVariant) {
      return (
        selectedVariant.display_Price ||
        selectedVariant.display_price ||
        product.display_price
      );
    }
    return product.display_price;
  };
  const getCurrentUnit = () => {
    if (selectedVariant) {
      return (
        selectedVariant.quantity || selectedVariant.quantity || product.quantity
      );
    }
    return product.quantity;
  };
  const getCurrentType = () => {
    if (selectedVariant) {
      return selectedVariant.Type || selectedVariant.Type || product.Type;
    }
    return product.Type;
  };

  const getStockStatus = () => {
    if (selectedVariant) {
      // Check variant-level stock
      return selectedVariant.inStock;
    }
    // Fallback to main product
    return product.status;
  };
  const handleClosePopup = () => {
    setShowLoginPopup(false);
  };

  useEffect(() => {
    if (product?.variants?.length > 0 && !selectedVariant && !product.status) {
      const availableVariant = product.variants.find((v) => v.inStock);
      if (availableVariant) setSelectedVariant(availableVariant);
    }
  }, [product]);
  return (
    <motion.div
      className="product-item relative flex flex-col border-gray-400 border rounded-lg p-3 sm:p-4 w-full max-w-[280px] sm:max-w-xs mx-auto bg-white"
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Favorite Button and Discount Tag */}
      {getDisplayPrice() && getCurrentPrice() && (
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
          <DiscountTag
            discount={Math.round(
              ((getDisplayPrice() - getCurrentPrice()) / getDisplayPrice()) *
                100
            )}
          />
        </div>
      )}

      <HeartProduct
        setShowLoginPopup={setShowLoginPopup}
        productId={product?._id}
        userId={userId}
      />

      {/* Product Image */}
      <motion.div className="product-image flex-1 mb-3 sm:mb-4 overflow-hidden">
        <RouterLink
          scrollBehavior="smooth"
          to={`/product/${product?.prd_Name}/${product?._id}`}
        >
          {/* <motion.img
            src={product?.image}
            alt={product?.prd_Name}
            loading="lazy"
            className="w-full h-full object-contain"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          /> */}
          <LazyLoadImage
            alt={product?.prd_Name}
            src={product?.image}
            effect="blur" // options: blur, opacity, black-and-white
            loading="lazy"
            className="w-full h-full object-contain"
          />
        </RouterLink>
      </motion.div>

      <div>
        {/* Product Details */}

        <motion.h3
          className="text-[0.9rem] md:text-lg font-semibold mb-1 sm:mb-2 line-clamp-2"
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {product?.prd_Name}
        </motion.h3>
        <div className="flex justify-between items-end  gap-2">
          <div className="">
            {getDisplayPrice() !== getCurrentPrice() && (
              <motion.div
                className="product-price text-[0.5rem]  md:text-base font-bold text-gray-400  line-through"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {`${currencySymbol}${getDisplayPrice()?.toFixed(2)}`}
              </motion.div>
            )}

            <motion.div
              className="product-price text-[0.6rem] md:text-lg font-bold text-gray-800 mb-2 sm:mb-3"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {`${currencySymbol}${getCurrentPrice()?.toFixed(2)}`}
            </motion.div>
          </div>
          <motion.div
            className="product-price text-[0.5rem] md:text-base font-bold  mb-2 sm:mb-3 "
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <p>{`${getCurrentUnit()} ${getCurrentType()}`}</p>
          </motion.div>
        </div>

        {/* Variant Selection */}
        {product?.variants?.length > 0 && (
          <OptionsDropdown
            variants={product.variants}
            onSelect={handleVariantSelect}
            selectedVariant={selectedVariant}
          />
        )}

        {/* Stock Status */}
        {!getStockStatus() ? (
          <motion.button
            layout
            disabled
            className="px-3 w-full sm:px-4 py-1.5 sm:py-2 bg-gray-300 text-white rounded-md cursor-not-allowed font-medium"
          >
            Out of Stock
          </motion.button>
        ) : (
          <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isInCart ? "in-cart" : "not-in-cart"}
                layout
                className={`grid ${
                  isInCart ? "grid-cols-2" : "grid-cols-1"
                } items-center gap-2`}
              >
                {isInCart ? (
                  <>
                    <motion.div
                      key="quantity-selector"
                      layout
                      className="quantity-selector max-sm:col-span-2 p-1.5 sm:p-1.5 flex items-center justify-between border border-gray-400 rounded-md overflow-hidden"
                      initial={{ opacity: 0, y: -10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.9 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <motion.button
                        onClick={decrementQuantity}
                        className="p-1 md:p-1.5 sm:p-2 text-white bg-primary hover:bg-primaryDark cursor-pointer rounded-[3px]"
                        disabled={quantity <= 1 || loading}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaMinus className="h-2 w-2 md:h-4 md:w-4" />
                      </motion.button>
                      <motion.span
                        className="px-1 md:px-2 sm:px-3 text-sm sm:text-base"
                        key={quantity}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        {quantity}
                      </motion.span>
                      <motion.button
                        onClick={incrementQuantity}
                        className="p-1 md:p-1.5 sm:p-2 text-white bg-primary hover:bg-primaryDark cursor-pointer rounded-[3px]"
                        disabled={loading}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaPlus className="h-2 w-2 md:h-4 md:w-4" />
                      </motion.button>
                    </motion.div>

                    <motion.button
                      layout
                      onClick={handleRemoveFromCart}
                      disabled={loading}
                      className="px-3 max-sm:col-span-2 sm:px-4 py-1.5 sm:py-2 bg-red-500 hover:bg-red-600 text-white rounded-md font-medium flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      {loading ? (
                        "Processing..."
                      ) : (
                        <>
                          <FaTrash size={12} />
                          <span className="hidden sm:inline">Remove</span>
                        </>
                      )}
                    </motion.button>
                  </>
                ) : (
                  <motion.button
                    layout
                    onClick={handleAddToCart}
                    disabled={loading || !getStockStatus()}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 cursor-pointer rounded-md font-medium flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base ${
                      !getStockStatus()
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-primary hover:bg-primaryDark"
                    } text-white`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-[0.6rem] md:text-base">
                      {loading ? "Processing..." : "Add to Cart"}
                    </p>
                  </motion.button>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}

        {/* Cart Action and Quantity Selector */}

        <LoginPopup
          handleClosePopup={handleClosePopup}
          setShowLoginPopup={setShowLoginPopup}
          showLoginPopup={showLoginPopup}
        ></LoginPopup>
      </div>
    </motion.div>
  );
};

export default ProductItem1;
