import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { currencySymbol } from "../../../constants/constants";
import OptionsDropdown from "../../../components/global/OptionsDropdown";
import {
  FaMinus,
  FaPlus,
  FaRegHeart,
  FaRegStar,
  FaStar,
  FaStarHalfAlt,
  FaTrash,
} from "react-icons/fa";
import { HiOutlineShare } from "react-icons/hi";
import Accordion from "../../../components/global/Accordion";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  clearProductDetails,
  fetchProductDetails,
} from "../../../redux/slices/productDetailsSlice";
import { ProductDetailsShrimmer } from "../../../components/shrimmers/ProductDetailsShrimmer";
import ShareButton from "../../../components/global/ShareButton";
import { message } from "antd";
import {
  addCartItem,
  removeCartItem,
  updateCartItemQuantity,
} from "../../../redux/slices/cartSlice";
import ReviewsComponent from "./ReviewsComponent";
import AddToWishlist from "./AddToWishlist";
import LoginPopup from "../../../components/global/LoginPopup";

const ProductDetails = () => {
  const dispatch = useDispatch();
  const { productId } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [isInCart, setIsInCart] = useState(false);
  const [cartItemId, setCartItemId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const {
    product,
    loading: productLoader,
    error,
  } = useSelector((state) => state.productDetails);
  const [selectedImage, setSelectedImage] = useState(null);
  const handleClosePopup = () => {
    setShowLoginPopup(false);
  };
  // Combine all images into one array
  const allImages = product
    ? [product.image, ...(product.images?.map((img) => img.image) || [])]
    : [];
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

  const handleAddToCart = async () => {
    if (!userId) {
      setShowLoginPopup(true);
      return;
    }

    setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromCart = async () => {
    if (!cartItemId) return;

    setLoading(true);

    try {
      await dispatch(removeCartItem(cartItemId)).unwrap();
      setIsInCart(false);
      setCartItemId(null);
      setQuantity(1);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityUpdate = async (newQuantity) => {
    setLoading(true);

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

  const getStockStatus = () => {
    if (selectedVariant) {
      // Check variant-level stock
      return selectedVariant.inStock;
    }
    // Fallback to main product
    return product.status;
  };

  useEffect(() => {
    if (product?.variants?.length > 0 && !selectedVariant && !product.status) {
      const availableVariant = product.variants.find((v) => v.inStock);
      if (availableVariant) setSelectedVariant(availableVariant);
    }
  }, [product]);
  useEffect(() => {
    dispatch(fetchProductDetails(productId));
    return () => dispatch(clearProductDetails());
  }, [dispatch, productId]);

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
  };

  // Set initial selected image when product loads
  useEffect(() => {
    if (product && allImages.length > 0) {
      setSelectedImage(allImages[0]);
    }
  }, [productId, product]);

  if (productLoader) return <ProductDetailsShrimmer />;
  if (error) return <div>error {error}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col  lg:flex-row gap-8">
        {/* Left Column - Thumbnails */}
        {allImages.length > 0 && (
          <div className="lg:w-1/12 flex lg:flex-col gap-2 order-2 lg:order-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
            {allImages.map((image, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`cursor-pointer border-2 w-fit p-2 h-fit rounded-md ${
                  selectedImage === image ? "border-primary" : "border-gray-300"
                }`}
                onClick={() => setSelectedImage(image)}
              >
                <motion.img
                  src={image.thumbnail || image}
                  alt={product.prd_Name}
                  className="w-fit h-16 object-cover rounded-md"
                  initial={{ opacity: 0 }}
                  loading="lazy"
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Center Column - Main Image */}
        <div className="lg:w-6/12 order-1 border-2 shadow rounded-md p-5 border-gray-300 w-fit h-fit lg:order-2">
          <div className="">
            <AnimatePresence mode="wait">
              {selectedImage && (
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.img
                    src={selectedImage}
                    alt={product.prd_Name}
                    className="w-full h-auto max-h-[60vh] object-contain rounded-lg "
                    whileHover={{ scale: 1.01 }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column - Product Details */}
        <div className="lg:w-5/12 order-3 lg:order-3">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold mb-2">{product?.prd_Name}</h1>
            {/* <p>
              Net Quantity : <span className="font-bold">{product?.Type}</span>
            </p> */}
            {getDisplayPrice() !== getCurrentPrice() && (
              <p className="my-2">
                MRP :
                <span className="font-bold line-through text-gray-500">{`${currencySymbol}${getDisplayPrice()?.toFixed(
                  2
                )}`}</span>
              </p>
            )}

            <div className="mb-6">
              <p className="text-xl font-bold">
                Price :
                <span className="text-xl text-primary">{`${currencySymbol} ${getCurrentPrice()?.toFixed(
                  2
                )}`}</span>
              </p>
            </div>
            <motion.div
              className="product-price  md:text-base  mb-2 sm:mb-3 "
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <p>{`${getCurrentUnit()} ${getCurrentType()}`}</p>
            </motion.div>
            {/* Overall Product Rating */}
            {product.overallRating > 0 && (
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-[2px] text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i}>
                      {product.overallRating >= i + 1 ? (
                        <FaStar />
                      ) : product.overallRating >= i + 0.5 ? (
                        <FaStarHalfAlt />
                      ) : (
                        <FaRegStar className="text-gray-300" />
                      )}
                    </span>
                  ))}
                </div>
                <span className="text-sm text-gray-700 font-medium">
                  {product.overallRating.toFixed(1)} / 5
                </span>
              </div>
            )}

            {/* {product?.display_price && product?.selling_price && (
              <p className="text-red-600 my-3">
                You save{" "}
                {Math.round(
                  ((product.display_price - product.selling_price) /
                    product.display_price) *
                    100
                )}
                % OFF
              </p>
            )} */}
            {product?.variants?.length > 0 && (
              <OptionsDropdown
                variants={product.variants}
                onSelect={handleVariantSelect}
                selectedVariant={selectedVariant}
                buttonTextClass="text-medium font-bold"
                optionTextClass="text-base font-semibold text-gray-700"
              />
            )}

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
                className="grid  grid-cols-1 md:grid-cols-2 gap-2"
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
                          className="quantity-selector p-1.5 sm:p-1.5 flex items-center justify-between border border-gray-400 rounded-md overflow-hidden"
                          initial={{ opacity: 0, y: -10, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.9 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <motion.button
                            onClick={decrementQuantity}
                            className="p-1.5 sm:p-2 text-white bg-primary hover:bg-primaryDark cursor-pointer rounded-[3px]"
                            disabled={quantity <= 1 || loading}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FaMinus size={10} />
                          </motion.button>
                          <motion.span
                            className="px-2 sm:px-3 text-sm sm:text-base"
                            key={quantity}
                            initial={{ scale: 1.2 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            {quantity}
                          </motion.span>
                          <motion.button
                            onClick={incrementQuantity}
                            className="p-1.5 sm:p-2 text-white bg-primary hover:bg-primaryDark cursor-pointer rounded-[3px]"
                            disabled={loading}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FaPlus size={10} />
                          </motion.button>
                        </motion.div>

                        <motion.button
                          layout
                          onClick={handleRemoveFromCart}
                          disabled={loading}
                          className="px-3 sm:px-4 max-sm:py-2.5 py-2  bg-red-500 hover:bg-red-600 text-white rounded-md font-medium flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base"
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
                        {loading ? "Processing..." : "Add to Cart"}
                      </motion.button>
                    )}
                  </motion.div>
                </AnimatePresence>
                <div className=" justify-center gap-4 items-center">
                  <AddToWishlist
                    productId={product?._id}
                    userId={userId}
                    setShowLoginPopup={setShowLoginPopup}
                  ></AddToWishlist>
                </div>
              </motion.div>
            )}

            <ShareButton></ShareButton>

            <Accordion title={"About the Product"}>
              <div className="my-3">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700">{product?.description}</p>
              </div>
            </Accordion>
            <Accordion title={"Highlights"}>
              <div className="my-3">
                <p className="text-gray-700">{product?.description}</p>
              </div>
            </Accordion>
          </motion.div>
        </div>
      </div>
      <LoginPopup
        handleClosePopup={handleClosePopup}
        setShowLoginPopup={setShowLoginPopup}
        showLoginPopup={showLoginPopup}
      ></LoginPopup>
      <ReviewsComponent reviews={product?.reviews} />
    </div>
  );
};

export default ProductDetails;
